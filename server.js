var express = require('express');
var qs = require('querystring');
var bodyParser = require('body-parser');
var favicon = require('express-favicon');
var favicon = require('serve-favicon');
var fs = require('fs');
//Need if we want to check req.file; 
var multer  = require('multer')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var cors = require('cors');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var path = require('path');
var config = require('./config.js');
var mongoose = require('mongoose');
var app = express();

//I believe we need if we want to check req.file
var upload = multer({ dest: 'uploads/' });

//I believe we need if we want to check req.file
app.use(upload.single('string'));
//DELETE BusBoy in package.json
//for the image on the top left corner of the tab, on the web browser                             
app.use(favicon(__dirname + "/favicon.ico"));

var http = require('http');

// //should have access to user mongoose model and message mongoose model with this.
// var User = require('./database/UserModel');
//I believe server is an instance of a event emitter. An object with many requesthandle properties. That is a tenative assessment. 
//Necessary for making sockets.
var server = http.Server(app);
//The docs are not clear on the next two lines.Both lines are necessary for sockets.
var socketio = require('socket.io');
var io = socketio(server);
// Added for deployment:                      
var port = process.env.PORT || '8080'; 

//listening to server
server.listen(port);
console.log("App listening on port || 8080");

var User = require('./database/UserModel');

app.set('port', process.env.PORT || 8080);
// app.use(cors());
app.use(logger('dev'));


// Need body parser so that req.body will not be undefined and will actually hold the data that is sent from the frontEnd. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

app.use(express.static(__dirname + '/client'));                 
//Serves up static files, otherwise we would not be able to load angular (and all the other bower components) in the index.html file
app.use('/bower_components', express.static(__dirname + '/bower_components'));


//for every path request. 
// app.get('*', function(req, res) {
//   // load the single view file (angular will handle the page changes on the front-end)
//         res.sendFile(__dirname + '/client/index.html'); 
//     });

// app.use(bodyParser.urlencoded({'extended':'true'}));            

//need this so that req.body will not be undefined and will actually hold the data that is sent from the frontEnd. 

// Once the server is running, it will be available for socket clients to connect. A client trying to establish a connection with the Socket.io server will start by initiating the handshaking process.

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */

 //makes sure that user is authenticated

function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, 'Shhhh');
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}


/*
 |--------------------------------------------------------------------------
 | Sockets Connection
 |--------------------------------------------------------------------------
 */




// Once the server is running, it will be available for socket clients to connect. A client trying to establish a connection with the Socket.io server will start by initiating the handshaking process.


/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */


function createJWT(user){
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, 'shhhh');
}


/*
A request handler is a function that will be executed every time the server receives a particular request, usually defined by an HTTP method (e.g., GET) and the URL path (i.e., the URL without the protocol, host, and port). The Express.js request handler needs at least two parameters—request, or simply req, and response, or res.
*/

//to allow cross origin (need to add more to this comment.)
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});



/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */

app.get('/api/me', function(req, res) {
  var test = Object.keys(req);
  console.log('req', req.params);
  User.user.findById(req.user, function(err, user) {
    console.log('this is the user crap', user)
    console.log('this, is the err', err);
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */

app.put('/api/me', function(req, res) {
  User.user.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with GitHub
 |--------------------------------------------------------------------------
 */






app.post('/auth/github', function(req, res) {
  console.log('heeyyy work it', res)
  var accessTokenUrl = 'https://github.com/login/oauth/access_token';
  var userApiUrl = 'https://api.github.com/user';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: '881163697cad6c7cc246638d4b98819dd5cf679e',
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
    accessToken = qs.parse(accessToken);
    var headers = { 'User-Agent': 'Satellizer' };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {
      console.log('this is a profile', profile);
      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        console.log('inside authorization if statement ---------------');
        // User.user.findOne({ github: profile.id }, function(err, existingUser) {
        //   console.log('this is the user in the database', existingUser);
        //   if (existingUser) {
        //     return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
        //   }
        //   var token = req.headers.authorization.split(' ')[1];
        //   // console.log('this is the token', token)
        //   var payload = jwt.decode(token, config.TOKEN_SECRET);
        //   User.user.findById(payload.sub, function(err, user) {
        //     if (!user) {
        //       return res.status(400).send({ message: 'User not found' });
        //     }
        //     user.github = profile.id;
        //     user.picture = user.picture || profile.avatar_url;
        //     user.displayName = user.displayName || profile.name;
        //     user.save(function() {
        //       var token = createJWT(user);
        //       res.send({ token: token });
        //     });
        //   });
        // });
      }
      // } else {
        // Step 3b. Create a new user account or return an existing one.
        User.user.findOne({ github: profile.id }, function(err, existingUser) {
          if (existingUser) {
            console.log('i am the existing user', existingUser)
            var token = createJWT(existingUser);
            return res.send({ token: token, user: existingUser });
          }
          var user = new User();
          user.github = profile.id;
          user.picture = profile.avatar_url;
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token, user: user });
          });
        });
      
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
app.post('/auth/unlink', ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.user.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});



var usersRoom;
//The first event we will use is the connection event. It is fired when a client tries to connect to the server; Socket.io creates a new socket that we will use to receive or send messages to the client.
io.on('connection', function (socket) {
  console.log('new connection');


  //some room will be a variable. 
  // io.to(usersRoom).emit(usersRoom);
  //listen for a signal called add-customer. General code
  // socket.on('add-customer', function(textFromEditor) {
  //   console.log("Just heard a add-customer from Joseph");
  //   //send a signal to frontEnd called notification
  //   io.emit('notification', textFromEditor);

  // });
//general code
  socket.on('/create', function(data) {
    usersRoom = data.title
    //Have the socket join a rooom that is named after the title of their document
    socket.join(data.title);
    //Listen for a emit from client that's message is the title of the document
    socket.on(data.title, function(data) {
      //send a signal to frontEnd called notification
      socket.broadcast.emit('notification', data);
      });
    });
  //working on chat feature with sockets
    socket.on('new message', function(message) {
      //general algorithim for storing messages shall go here. 

      //hard coded message document to test persisting chat data
      var JosephMessages = new User.messages({
        nameOfChat: "Joseph", 
        messageContent: "This is a message"
      });
      //save josephMessages document into the database
      JosephMessages.save(function(err, results){
        if (err) {
          console.log("err", err);
        }
        else {
          console.log("Saved into MONGODB Success")
        }
        //search for messages that have Joseph as the name of their chat
        User.messages.find({ nameOfChat: 'Joseph' }, function(err, results) {
          console.log("ALL THE JOSEPH MESSAGES", results);
        });
      })

      //Sending a signal to the front end, along with the message from chat. This is so we can test the chat feature. Will build off of it later. 
      io.emit('publish message', message);
      });
});

//content will hold the data from the uploaded file
var content;
//Need to build this function to get around asynchronous behavior.
var sendFileDataToClient = function(data) {
  //send the data from the file to the client. 
  io.emit('fileData', content);
}

//Initiating the file upload. Immediately happens after someone clickes the upload file button
app.post('/fileUpload', function(req, res, next) {
  //collect the data from the file in a human readable form. 
     fs.readFile(req.file.path, 'ascii', function ( error, data ) {
      if ( error ) {
        console.error( error );
      } else {
        //content is being asynchronously set to the data in the file
        content = data;
        //To get around the synchronous behavior we wrap the next step into the function sendFileDataToClient. Which will just emit the content, but this way we are sure that content is done receiving the data from the file.
        sendFileDataToClient(content)

      }
  });
     //DELETE readFile in package.json
});

