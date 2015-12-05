//require express
var express = require('express');
//instantiate an express object
var app = express();                              
var bodyParser = require('body-parser');   
var favicon = require('express-favicon');
var cookieParser = require('cookie-parser');


    // configuration =================

//serves up static files, otherwise we would not be able to load the index.html file
app.use(express.static(__dirname + '/client'));                 
//serves up static files, otherwise we would not be able to load angular (and all the other bower components) in the index.html file
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(bodyParser.urlencoded({'extended':'true'}));            

//need this so that req.body will not be undefined and will actually hold the data that is sent from the frontEnd. 
app.use(bodyParser.json());                                  


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

/*
A request handler is a function that will be executed every time the server receives a particular request, usually defined by an HTTP method (e.g., GET) and the URL path (i.e., the URL without the protocol, host, and port). The Express.js request handler needs at least two parameters—request, or simply req, and response, or res.
*/

//to allow cross origin (need to add more to this comment.)
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

var requestHandlerFuncForLogInOrSignUp = function(req, res, next){
 //query relational database to get the users information that will go on profile page
   console.log("this is req.body", req.body.name);
   //do not forget to stringify what you send back to the server.
   var test = req.body;
   //Using the new keyword, the create() method creates a new model instance, which is populated using the request body. Where new User is, we will have to place a require variable with a .user 
   var testUser = new db({
    username: test.name
   });
   //Finally, you call the model instance's save() method that either saves the user and outputs the user object, or fail, passing the error to the next middleware.
   //change this .save to .findOrCreate
   testUser.save(function(err, testUser){
      //if an error exists
        if(err) {
          //logs the error
          console.log(err);
        }else {
          //res.send() : Sends the HTTP response.This method performs many useful tasks for simple non-streaming responses: For example, it automatically assigns the Content-Length HTTP response header field (unless previously defined) and provides automatic HEAD and HTTP cache freshness support.
          res.send('Successfully inserted!!!');
        }
      });

};

app.post('/login', requestHandlerFuncForLogInOrSignUp);

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
  console.log("In the postAuth GIthub")
  var accessTokenUrl = 'https://github.com/login/oauth/access_token';
  var userApiUrl = 'https://api.github.com/user';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: "its a secret",
    redirect_uri: req.body.redirectUri
  };

//   // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
    accessToken = qs.parse(accessToken);
    var headers = { 'User-Agent': 'Satellizer' };

//     // Step 2. Retrieve profile information about the current user.
    request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {

//       // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ github: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.github = profile.id;
            user.picture = user.picture || profile.avatar_url;
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
//         // Step 3b. Create a new user account or return an existing one.
        User.findOne({ github: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.github = profile.id;
          user.picture = profile.avatar_url;
          user.displayName = profile.name;
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


//The first event we will use is the connection event. It is fired when a client tries to connect to the server; Socket.io creates a new socket that we will use to receive or send messages to the client.
io.on('connection', function(socket) {
  console.log('new connection');
  console.log("socket.broadcast", socket.broadcast)
  // The socket object is the same socket object that will be used for the connection and it holds some connection properties. One important property is the socket.request property, which represents the handshake HTTP request.
  
  //listen for a signal called add-customer
  socket.on('add-customer', function(textFromEditor) {
    console.log("Just heard a add-customer from Joseph");
    //send a signal to frontEnd called notification
    io.emit('notification', textFromEditor);

  });
});


