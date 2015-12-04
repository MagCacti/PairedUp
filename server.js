var express  = require('express');
var app      = express();                               // create our app w/ express
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var favicon = require('express-favicon');
 var cookieParser = require('cookie-parser');


    // configuration =================


    app.use(express.static(__dirname + '/client'));                 // set the static files location /public/img will be /img for users
    app.use('/bower_components', express.static(__dirname + '/bower_components'));
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json

    // listen (start app with node server.js) ======================================
    console.log("App listening on port 8080");






// var express = require('express');
var path = require('path');
// var favicon = require('express-favicon');
// var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
var passport = require('passport');
var githubsecret = require('passport-github').Strategy;
// var secret = require('githubsecret');
// // var findOneOrCreate = require('mongoose-find-one-or-create');
// //should have access to user mongoose model with this
var db = require('./server/database/UserModel');
// /*
// */
var http = require('http');
var server = http.Server(app);
var socketio = require('socket.io');
var io = socketio(server);

    server.listen(8080);
// //use the http module of Node.js to create a server and wrap the Express application.

// //server object is then passed to the Socket.io module and serves both the Express application and the Socket.io server.
// //Used the http core module to create a server object that wraps your Express app object.  Returned the new server object instead of the Express application object.When the server starts, it will run your Socket.io server along with your Express application. 
// var server = http.createServer(app);
// var io = socketio.listen(server);

// // Once the server is running, it will be available for socket clients to connect. A client trying to establish a connection with the Socket.io server will start by initiating the handshaking process.


// // When a client wants to connect the Socket.io server, it will first send a handshake HTTP request. The server will then analyze the request to gather the necessary information for ongoing communication. It will then look for configuration middleware that is registered with the server and execute it before firing the connection event. When the client is successfully connected to the server, the connection event listener is executed, exposing a new socket instance. Once the handshaking process is over, the client is connected to the server and all communication with it is handled through the socket instance object. For example, handling a client's disconnection event will be as follows:
// // io.on(' connection', function(socket){ 
// //   // The socket object is the same socket object that will be used for the connection and it holds some connection properties. One important property is the socket.request property, which represents the handshake HTTP request.

// // /* ... */ console.log("Socket connection initiated.");
// //   socket.on(' disconnect', function() { 
// //     console.log(' user has disconnected');
// //    });

// // }); 
// // server.listen(port);
// //start express to app variable


// /*
// A request handler is a function that will be executed every time the server receives a particular request, usually defined by an HTTP method (e.g., GET) and the URL path (i.e., the URL without the protocol, host, and port). The Express.js request handler needs at least two parameters—request, or simply req, and response, or res.
// */

// var requestHandlerFunc = function (req, res, next) {
//  res.end("Hello World");
//  res.sendFile(__dirname + '/client/index.html');

//  next();
// };
// // //Nice Template for a get request using express
// // app.get('/', requestHandlerFunc);
// //function being called when there is a get request to the route above.

var requestHandlerFuncForLogInOrSignUp = function(req, res, next){
//  //query relational database to get the users information that will go on profile page
//  //if the user is not in database
   
//    //Using the new keyword, the create() method creates a new model instance, which is populated using the request body. Where new User is, we will have to place a require variable with a .user 
   var user = new User(req.body);
//    //Finally, you call the model instance's save() method that either saves the user and outputs the user object, or fail, passing the error to the next middleware.
   user.save(function(err){ 
//        //if error
       if (err){
//        //return the next function with the error as the argument
        return next(err); 
        }else{ 
//            //Sends a JSON response. This method is identical to res.send() with an object or array as the parameter. However, you can use it to convert other values to JSON.
           res.json(user);

//            //res.send() : Sends the HTTP response.This method performs many useful tasks for simple non-streaming responses: For example, it automatically assigns the Content-Length HTTP response header field (unless previously defined) and provides automatic HEAD and HTTP cache freshness support.

//            //log in and start a user session. 
       } 
   });
// //else 
//    //log in and start a user session.

//  //use express-sessions to store in mongoose database whether a user is logged in or not

};

app.post('/login', requestHandlerFuncForLogInOrSignUp);

// //When the user updates their information. 
var requestHandlerFuncForUpdatingInfo = function(req, res, next) {
//    //find the user who we are updating
//    //update them. 
//    //send the info back to frontEnd(?). 
};
app.post("/updated",requestHandlerFuncForUpdatingInfo);

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

console.log("io", io);
app.get('*', function(req, res) {
        res.sendFile(__dirname + '/client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
console.log("Before io")
io.on('connection', function(socket) {
  console.log('new connection');

  socket.on('add-customer', function(customer) {
    console.log("Muha");
    io.emit('notification', {
      message: 'new customer',
      customer: customer
    });
  });
});
io.listen//not sure if importnat

// console.log("Listening on Port " + port)
// // app.get('*', function (req, res) {
// // });
// /*End Github Login*/
// app.listen(port);