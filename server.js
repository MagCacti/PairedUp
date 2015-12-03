var express = require('express');
var path = require('path');
var favicon = require('express-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
// var passport = require('passport');
// var GitHubStrategy = require('passport-github').Strategy;
// var secret = require('githubsecret');
// var findOneOrCreate = require('mongoose-find-one-or-create');
//should have access to user mongoose model with this
var db = require('./server/database/UserModel');

// mongoose.connect('mongodb://localhost/users');
// db = mongoose.createConnection('mongodb://localhost/users');

//start express to app variable
var app = express();
var port = 8000;
//need this so that req.body will not be undefined and will actually hold the data that is sent from the frontEnd. 
app.use(bodyParser.json())
//not sure what this is for. 
// app.use(bodyParser.urlencoded({
//   extended:true
// }))

/*
A request handler is a function that will be executed every time the server receives a particular request, usually defined by an HTTP method (e.g., GET) and the URL path (i.e., the URL without the protocol, host, and port). The Express.js request handler needs at least two parameters—request, or simply req, and response, or res.
*/
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

var requestHandlerFunc = function (req, res) {
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 res.end("Hello World");
};
//Nice Template for a get request using express
app.get('/', requestHandlerFunc);
//function being called when there is a get request to the route above.

var requestHandlerFuncForLogInOrSignUp = function(req, res, next){
 //query relational database to get the users information that will go on profile page
 //if the user is not in database
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

//When the user updates their information. 
var requestHandlerFuncForUpdatingInfo = function(req, res, next) {
   //find the user who we are updating
   //update them. 
   //send the info back to frontEnd(?). 
};
app.post("/updated",requestHandlerFuncForUpdatingInfo);

//Start the express.js web server and output a user-friendly terminal message in a callback
// User.plugin(findOneOrCreate);
// passport.use(new GitHubStrategy({
//     clientID: secret.clientID,
//     clientSecret: secret.clientSecret,
//     callbackURL: "http://127.0.0.1:3000/auth/github/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOneOrCreate({ githubId: profile.id}, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

app.listen(port, function(){
 console.log('The server is running, ' + ' please, open your browser at http://localhost:%s', port); 
});