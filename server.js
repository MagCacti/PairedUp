//require express
var express = require('express');
//instantiate an express object
var favicon = require('serve-favicon');
var app = express();                              
app.use(favicon(__dirname + "/favicon.ico"));
var fs = require('fs');
var multer  = require('multer')
// var favicon = require('express-favicon');
var cookieParser = require('cookie-parser');
var request = require('request');
var qs = require('querystring');
var jwt = require('jwt-simple');
var moment = require('moment');
var hardcodedUsers = [{name: "Kristina"}, {name: "Joseph"}]
//read contents of entire file.
var readFile = require( 'utils-fs-read-file' );
    // configuration =================
//for file uploading
// var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var bodyParser = require('body-parser');   
app.use(upload.single('string'));
//the next two lines may be unusual. 
// var busboy = require("connect-busboy");
// app.use(busboy({ immediate: true }));
//ending file uploading modules

//serves up static files, otherwise we would not be able to load the index.html file
app.use(express.static(__dirname + '/client'));                 
//serves up static files, otherwise we would not be able to load angular (and all the other bower components) in the index.html file
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(bodyParser.urlencoded({'extended':'true'}));            

//need this so that req.body will not be undefined and will actually hold the data that is sent from the frontEnd. 
app.use(bodyParser.json());   
// app.use(bodyParser());                               


var path = require('path');
var passport = require('passport');
var githubsecret = require('passport-github').Strategy;
// var secret = require('githubsecret');
// // var findOneOrCreate = require('mongoose-find-one-or-create');
// //should have access to user mongoose model with this
var mongoose = require('mongoose');

var db = require('./server/database/UserModel');

//Necessary for sockets.
var http = require('http');

//I believe server is an instance of a event emitter. An object with many requesthandle properties. That is a tenative assessment. 
//Necessary for making sockets.
var server = http.Server(app);

//The docs are not clear on the next two lines.Both lines are necessary for sockets.
var socketio = require('socket.io');
var io = socketio(server);

//listening to server
server.listen(8080);

// Once the server is running, it will be available for socket clients to connect. A client trying to establish a connection with the Socket.io server will start by initiating the handshaking process.
console.log("App listening on port 8080");


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

// var requestHandlerFuncForLogInOrSignUp = function(req, res, next){
//  //query relational database to get the users information that will go on profile page
//    console.log("this is req.body", req.body.name);
//    //do not forget to stringify what you send back to the server.
//    var test = req.body;
//    //Using the new keyword, the create() method creates a new model instance, which is populated using the request body. Where new User is, we will have to place a require variable with a .user 
//    var testUser = new db({
//     username: test.name
//    });
//    //Finally, you call the model instance's save() method that either saves the user and outputs the user object, or fail, passing the error to the next middleware.
//    //change this .save to .findOrCreate
//    testUser.save(function(err, testUser){
//       //if an error exists
//         if(err) {
//           //logs the error
//           console.log(err);
//         }else {
//           //res.send() : Sends the HTTP response.This method performs many useful tasks for simple non-streaming responses: For example, it automatically assigns the Content-Length HTTP response header field (unless previously defined) and provides automatic HEAD and HTTP cache freshness support.
//           res.send('Successfully inserted!!!');
//         }
//       });

// };

// app.post('/login', requestHandlerFuncForLogInOrSignUp);

// //When the user updates their information. 
var requestHandlerFuncForUpdatingInfo = function(req, res, next) {
//    //find the user who we are updating
//    //update them. 
//    //send the info back to frontEnd(?). 
};
app.post("/updated",requestHandlerFuncForUpdatingInfo);

//Not sure if we still need the next 13 lines. 

// //Start the express.js web server and output a user-friendly terminal message in a callback
// // User.plugin(findOneOrCreate);
// // passport.use(new GitHubStrategy({
// //     clientID: secret.clientID,
// //     clientSecret: secret.clientSecret,
// //     callbackURL: "http://127.0.0.1:3000/auth/github/callback"
// //   },
// //   function(accessToken, refreshToken, profile, done) {
// //     User.findOneOrCreate({ githubId: profile.id}, function (err, user) {
// //       return done(err, user);
// //     });
// //   }
// // ));




// /*Login Github Oauth Angular stuff too*/
app.post('/auth/github', function(req, res) {
  console.log('this.....', res);
  console.log("In the postAuth GIthub")
  var accessTokenUrl = 'https://github.com/login/oauth/access_token';
  var userApiUrl = 'https://api.github.com/user';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: "ec5ccdd036aede19767499594e72fc90e7cf734e",
    redirect_uri: req.body.redirectUri,
    // grant_type: 'authorization_code'
  };

//   // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true}, function(err, response, accessToken) {
    // accessToken = qs.parse(accessToken);
    console.log('heyyyyyy-----', accessToken);
    var headers = { 'User-Agent': 'Satellizer' };

//     // Step 2. Retrieve profile information about the current user.
    request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {
        console.log('this is the profile------', profile);
//       // Step 3a. Link user accounts.
      if (req.headers.authorization) {

        // db.findOne({ github: profile.login }, function(err, existingUser) {
        //   // console.log('in post to db ---------------', existingUser);
        //   if (existingUser) {
        //     return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
        //   }
        //   var token = req.headers.authorization.split(' ')[1];
        //   var payload = jwt.decode(token, 'shhhh');
        //   db.findById(payload.sub, function(err, user) {
        //     if (!user) {

        //       console.log('user ----------', user);
        //       return res.status(400).send({ message: 'User not found' });
        //     }
        //     // var user = new db();
        //     user.github = profile.login;
        //     user.picture = user.picture || profile.avatar_url;
        //     user.displayName = user.displayName || profile.name;
        //     user.save(function() {
        //       var token = createJWT(user);
        //       res.send({ token: token });
        //     });
        //   });
        // });
      
//         // Step 3b. Create a new user account or return an existing one.
        db.findOne({ github: profile.login }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new db();
          user.username = profile.login;
          // console.log("this is the github userid", user.github)
          user.picture = profile.avatar_url;
          user.name = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

//for every path request. 
app.get('*', function(req, res) {
  // load the single view file (angular will handle the page changes on the front-end)
        res.sendFile(__dirname + '/client/index.html'); 
    });
var usersRoom;
//Example of socket creation
// app.post('/createSocket', function(req, res) {
//   usersRoom = req.body.title;
//   // var nsp = io.of('/my-namespace');
//   // nsp.on('connection', function(socket){
//   //   console.log('someone connected'):
//   // });
//   // nsp.emit('hi', 'everyone!');
//   // io.on('connection', function(socket){
//   // console.log('HELLO FRIEND');
//   //   socket.join(usersRoom);
//   globalSocket.join(usersRoom);
//   console.log("usersRoom", usersRoom)
//   io.emit(usersRoom);
//   // io.to(usersRoom).emit(usersRoom);

//   // });
// });
// var globalSocket;
//The first event we will use is the connection event. It is fired when a client tries to connect to the server; Socket.io creates a new socket that we will use to receive or send messages to the client.
io.on('connection', function(socket) {
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
    // console.log("usersRoom", usersRoom)
    socket.join(data.title);
    //send a signal to frontEnd called notification
    io.emit(usersRoom,data);
    socket.on(data.title, function(data) {
      console.log("Just heard a add-customer from Joseph");
      //send a signal to frontEnd called notification
      socket.broadcast.emit('notification', data);
      });
    });
  //working on chat feature with sockets
    socket.on('new message', function(message) {
      // console.log('db', db);
      // window.pairedUp = '123';
      var JosephMessages = new db.messages({
        nameOfChat: "Joseph", 
        messageContent: "This is a message"
      });
      JosephMessages.save(function(err, results){
        if (err) {
          console.log("err", err);
        }
        else {
          console.log("Saved into MONGODB Success")
        }
        db.messages.find({ nameOfChat: 'Joseph' }, function(err, results) {
          console.log("ALL THE JOSEPH MESSAGES", results);
        });
      })
      //store message in database. 
      // console.log("Going through new message socket.")
      //sending stuff back to fronEnd for example. 
      // console.log("message", message)
      io.emit('publish message', message);
      });



  // socket.on('addToRoom', function(roomName) {
  //     socket.join(roomName);
  // });
   
  // socket.on('removeFromRoom', function(roomName) {
  //     socket.leave(roomName);
  // });

});

app.get('/testingGettingTextDocument', function(req,res) {
  console.log("Content on the server side before giving to the client.", content)
  // return JSON.stringify(content);
  res.json(content);
})
var content;
var consoleLog = function(data) {
 console.log("This is the data of the file in the other function",data);
}
    var onFile = function ( error, data ) {
      if ( error ) {
        console.error( error );
      } else {
        console.log( data );
        content = data;
      }
     }
//Checking the upload
app.post('/fileUpload', /*upload.single('string') ,*/function(req, res, next) {
  console.log("Successfully uploaded a file.");
    console.log("req.body", req.body); //form fields
    // console.log("req.file", req.file); //form fields
    // console.log(req.headers['content-type'])
    /* example output:
    { title: 'abc' }
     */
     // console.log("This is the path ./" +req.file.path)
     readFile(req.file.path, 'ascii', onFile );
     console.log("This is console before emiting it by socket", content)
      io.emit('fileData', content);
     // fs.readFile(req.file.path, 'ascii',function (err, data) {
     //   if (err) throw err;
     //   content = data;
     //   // console.log("data from fs readFile", data);
     // });
     // // console.log("this is content", content)
     // consoleLog(content);
    // console.log("req.file",req.file); //form files
    /* example output:
              { fieldname: 'upl',
                originalname: 'grumpy.png',
                encoding: '7bit',
                mimetype: 'image/png',
                destination: './uploads/',
                filename: '436ec561793aa4dc475a88e84776b1b9',
                path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
                size: 277056 }
     */
    // res.status(204).end();
  // console.log("Req", req);
  // if(req.busboy) {
      //   req.busboy.on("file", function(fieldName, fileStream, fileName, encoding, mimeType) {
      //       //Handle file stream here
      //   console.log("We went through the busBoy")
      //   console.log("FieldName", fieldName);
      //   console.log("FileStream", fileStream);
      //   console.log("FileName", fileName);
      //   console.log("Encoding", encoding);
      //   });
      //   req.busboy.on('field', function(fieldname, val) {
      //   console.log(fieldname, val);
      // });
      // req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      //   console.log("in the file busboy listner")
      //     if (!filename) {
      //       // If filename is not truthy it means there's no file
      //       return;
      //     }
      //     // Create the initial array containing the stream's chunks
      //     file.fileRead = [];

      //     file.on('data', function(chunk) {
      //       // Push chunks into the fileRead array
      //       this.fileRead.push(chunk);
      //     });

      //     file.on('error', function(err) {
      //       console.log('Error while buffering the stream: ', err);
      //     });

      //     file.on('end', function() {
      //       // Concat the chunks into a Buffer
      //       var finalBuffer = Buffer.concat(this.fileRead);

      //       req.files[fieldname] = {
      //         buffer: finalBuffer,
      //         size: finalBuffer.length,
      //         filename: filename,
      //         mimetype: mimetype
      //       };

      //     });
      //   });
      // console.log("req.body", req.body)
      // console.log("req.files", req.files)
      //   var totalFile = req.pipe(req.busboy);
      //   console.log(totalFile)
      //   console.log("Req.body", req.body);
      //   return req.pipe(req.busboy);
    // }
    //Something went wrong -- busboy was not loaded
});

