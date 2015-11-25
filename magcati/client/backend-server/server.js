var express = require('express');
var path = require('path');
var favicon = require('express-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


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

var requestHandlerFuncForSignUp = function(req, res){
  //need to store info in relational database
  //use express-sessions to store in redis database whether a user is logged in or not

};
app.post('/mentee', requestHandlerFuncForSignUp);

app.post('/mentor', requestHandlerFuncForSignUp);

var requestHandlerFuncForLogIn = function(req, res){
  //query relational database to get the users information that will go on profile page
  //use express-sessions to store in redis database whether a user is logged in or not

};

app.post('/login', requestHandlerFuncForLogIn);

//Start the express.js web server and output a user-friendly terminal message in a callback
app.listen(port, function(){
  console.log('The server is running, ' + ' please, open your browser at http://localhost:%s', port); 
});

