var express = require('express');
var path = require('path');
var favicon = require('express-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var passport = require('passport');
// var GitHubStrategy = require('passport-github').Strategy;
// var secret = require('githubsecret');
// var findOneOrCreate = require('mongoose-find-one-or-create');
//should have access to user mongoose model with this
var db = require('./server/database/UserModel');

//start express to app variable
var app = express();
var port = 8000;


/*
A request handler is a function that will be executed every time the server receives a particular request, usually defined by an HTTP method (e.g., GET) and the URL path (i.e., the URL without the protocol, host, and port). The Express.js request handler needs at least two parameters—request, or simply req, and response, or res.
*/

var requestHandlerFunc = function (req, res) {
 res.end("Hello World");
};
//Nice Template for a get request using express
app.get('/', requestHandlerFunc);
//function being called when there is a get request to the route above.

var requestHandlerFuncForLogInOrSignUp = function(req, res, next){
 //query relational database to get the users information that will go on profile page
 //if the user is not in database
   
   //Using the new keyword, the create() method creates a new model instance, which is populated using the request body. Where new User is, we will have to place a require variable with a .user 
   var user = new User(req.body);
   //Finally, you call the model instance's save() method that either saves the user and outputs the user object, or fail, passing the error to the next middleware.
   user.save(function(err){ 
       //if error
       if (err){
       //return the next function with the error as the argument
        return next(err); 
        }else{ 
           //Sends a JSON response. This method is identical to res.send() with an object or array as the parameter. However, you can use it to convert other values to JSON.
           res.json(user);

           //res.send() : Sends the HTTP response.This method performs many useful tasks for simple non-streaming responses: For example, it automatically assigns the Content-Length HTTP response header field (unless previously defined) and provides automatic HEAD and HTTP cache freshness support.

           //log in and start a user session. 
       } 
   });
//else 
   //log in and start a user session.

 //use express-sessions to store in mongoose database whether a user is logged in or not

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




/*Login Github Oauth Angular stuff too*/
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

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
    accessToken = qs.parse(accessToken);
    var headers = { 'User-Agent': 'Satellizer' };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
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
        // Step 3b. Create a new user account or return an existing one.
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




/*End Github Login*/
app.listen(port, function(){
 console.log('The server is running, ' + ' please, open your browser at http://localhost:%s', port); 
});