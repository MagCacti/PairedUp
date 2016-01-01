var express = require('express');
var qs = require('querystring');//ask if I can delete this
var bodyParser = require('body-parser');
var _ = require('underscore');
// var favicon = require('express-favicon');
// var favicon = require('serve-favicon');
var fs = require('fs');
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var request = require('request');//ask if I can delete this
var path = require('path');
var config = require('../config.js');
var mongoose = require('mongoose');
var uri = config.MONGO_URI; 

mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', function(err){
  console.log('connection error', err);
});
db.once('open', function(){
  console.log('connect');
});

var app = express();
var http = require('http');
var server = http.Server(app);
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');
var morgan = require('morgan');
//I believe we need if we want to check req.file
var upload = multer({ dest: 'uploads/' });
var socketio = require('socket.io');
var io = require('./socket/socket')(server);

server.listen(8080); 
console.log("App listening on port 8080");
// var User = require('./userProfile/UserModel').user;
// var Skills = require('./database/SkillsModel').skills;
// var Messages = require('./database/MessageModel').messages;


var routesActivation = require('./routes');

app.set('port', process.env.PORT || 8080);
app.use(upload.single('string'));
// app.use(favicon("../favicon.ico"));
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//serves up static files, otherwise we would not be able to load angular (and all the other bower components) in the index.html file
app.use(express.static('../client'));

app.use(passport.initialize());
app.use(passport.session());
app.use(session({ 
  name: "UserFromPearedUp",
  secret: "keyboard cat", 
  resave: true, 
  saveUninitialized: true, 
  cookie: { path: '/', httpOnly: false, secure: false, maxAge: null }
   }));


//content will hold the data from the uploaded file

var content;
//Need to build this function to get around asynchronous behavior.
var sendFileDataToClient = function() {
  //send the data from the file to the client. 
  io.emit('fileData', content);
};

//Initiating the file upload. Immediately happens after someone clickes the upload file button. Cannot export this because of sendFileDataToClient. That function has io defined and that would be difficult to replicate for another file.
app.post('/fileUpload', function(req, res, next) {
    //collect the data from the file in a human readable form. 

    fs.readFile(req.file.path, 'ascii', function ( error, data ) {
      if ( error ) {
        console.error( error );
      } else {
        //content is being asynchronously set to the data in the file
        content = data;
        //To get around the synchronous behavior we wrap the next step into the function sendFileDataToClient. Which will just emit the content, but this way we are sure that content is done receiving the data from the file.
        sendFileDataToClient(content);
        res.json({status: "file is uploaded"});
      }
    });
  });

routesActivation(app);

