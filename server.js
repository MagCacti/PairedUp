var express = require('express');
var qs = require('querystring');
var bodyParser = require('body-parser');
var favicon = require('express-favicon');
var favicon = require('serve-favicon');
var fs = require('fs');
//Need if we want to check req.file; 
var multer  = require('multer');
var cookieParser = require('cookie-parser');
// var cors = require('cors');
var request = require('request');
// var jwt = require('jwt-simple');
// var moment = require('moment');
var path = require('path');
var config = require('./config.js');
var mongoose = require('mongoose');
var app = express();
var http = require('http');
var server = http.Server(app);
var passport = require('passport');
var flash    = require('connect-flash');
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var morgan = require('morgan');
var logger = require('morgan');
var uuid = require('node-uuid');
var rooms = {};
var userIds = {};
var UserAuthUtil = require('./UserSignIn.js');
//I believe we need if we want to check req.file
var upload = multer({ dest: 'uploads/' });

var socketio = require('socket.io');
var io = socketio(server);
server.listen(8080);
console.log("App listening on port 8080");


var db = require('./database/UserModel');
var User = db.user;
var userDocument = db.userDocument;
var Messages = db.messages;
var Skills = db.skills;


app.set('port', process.env.PORT || 8080);
app.use(upload.single('string'));
app.use(favicon(__dirname + "/favicon.ico"));
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/client'));

//serve up static files. For webRtc

// expressApp.use(express.static(__dirname + '/../public/dist'));   

//serves up static files, otherwise we would not be able to load angular (and all the other bower components) in the index.html file
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ 
  name: "UserFromPearedUp",
  secret: "keyboard cat", 
  resave: true, 
  saveUninitialized: true, 
  cookie: { path: '/', httpOnly: false, secure: false, maxAge: null }
   }));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

//to allow cross origin (need to add more to this comment.)
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.

/*
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
*/
//look into deleting the line under this one.
app.get('/', function(req, res){});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
var globalProfile;
// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
//Step 1
app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//Step 2
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  //This is the request handler that will be called when they click the log in to get hub. 
  UserAuthUtil.directToProfile);

//The next four lines do not appear to do anything. I will double check, then delete if proven true.
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// This will be the route to call when my page gets redirected to the profile. So my profile page should do a http.get to this route automatically once the user is logged in. 
//Step 3
app.get('/account', ensureAuthenticated, function(req, res){
  res.json(req.user);
});

app.get('/login', UserAuthUtil.sendingUserToClient);

// app.get('/userprofile', function(req, res, next) {
//   User.find(function(err, users){
//     if(err){ return next(err); }

//     res.json(users);
//   });
// });

app.get('/skills', function(req, res, next){
  User.find(function(err, user){
    if(err){next(err);}
    res.json(user);
  });
});


app.param('user', function(req, res, next, id) {
  var query = User.findById(id);
  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find user')); }

    req.user = user;
    return next();
  });
});

//this is not being integrated yet DONT DELETE
// app.get('/skills/:user', function(req, res, next) {
//   console.log('this is a single /skills/:user', req.user)
//   req.user.populate('skills', function(err, user){
  
//   if (err){return next(err)}
//   res.json(req.user);
//   })
// });

//this post to the database. The :user params dont necessarily work yet though
app.post('/skills/:user', function(req, res, next) {
  var skills = new Skills(req.body);
  skills.user = req.user;
  // console.log('this is skills/:user post:', req.user)
  console.log('this is skills/:user req.user:', req.user);
    // comment.post = req.post;

  skills.save(function(err, skill){
    if(err){ return next(err); }

    req.user.skills.push(skill);
    req.user.save(function(err, user) {
      if(err){ return next(err); }

      res.json(skill);
    });
  });
});



//if the person is signed in and goes back to the profile page
app.post('/getFromDatabaseBecausePersonSignedIn', function(req, res) {

  //find the user with the display name
  User.findOne({displayName: req.body.displayName}, function (err, user) {
        if (user) {
          res.json({user:user});
        }else if (err) {
          return "This is error message: " + err; 
        }

      });
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
//Step 4:
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    console.log('this is ensureAuthenticated', isAuthenticated);
    return next(); }
  res.redirect('/login');
}



  //Step 5
passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_SECRET,
    callbackURL: "http://127.0.0.1:8080/auth/github/callback"
  }, UserAuthUtil.setingUserToGlobalProfile));


var usersRoom;


//The first event we will use is the connection event. It is fired when a client tries to connect to the server; Socket.io creates a new socket that we will use to receive or send messages to the client.
io.on('connection', function(socket) {
  //this corresponds to the socket.emit('new message') on the client
  socket.on('new message', function(message) {
    //message - data from the cliet side 
    console.log('this is the incoming message', message);
    var messages = new Messages(message);
    //messages.create etc were all defined in the messages model
    messages.created = message.date ;
    messages.text = message.text;
    messages.displayName = message.username;
    messages.save(function(err, results){
      if(err){
        console.log('you have an error', err);
      }
      console.log('you save the chat. check mongo.', results);
    });


      ///Collect all the messages now in database 

      var foundMessages;
      Messages.find(function(err, msg){
        if(err){
          return console.log('you have an err get chats from the DB', err);
        }
        // console.log('MESSAGES from get request', req)
        foundMessages = msg;
        //this will post all the messages from the database
        io.emit('publish message', foundMessages);
      });
    });
//general code
  socket.on('/create', function(data) {
    usersRoom = data.title;
    //Have the socket join a rooom that is named after the title of their document
    socket.join(data.title);
    //Listen for a emit from client that's message is the title of the document
    socket.on(data.title, function(data) {
      //send a signal to frontEnd called notification
      socket.broadcast.emit('notification', data);
      });
    });
  
      //Sending a signal to the front end, along with the message from chat. This is so we can test the chat feature. Will build off of it later. 

    /* 

    Stuff for WebRtc

    */
        var currentRoom, id;
    //The init event is used for initialization of given room. 

        socket.on('init', function (data, fn) {
          //If the room is not created we create the room and add the current client to it. 
        //We generate room randomly using node-uuid module
          currentRoom = (data || {}).room || uuid.v4();
          var room = rooms[currentRoom];
          if (!data) {
            rooms[currentRoom] = [socket];
            id = userIds[currentRoom] = 0;
            fn(currentRoom, id);
            console.log('Room created, with #', currentRoom);
          } else {
            if (!room) {
              return;
            }
    //If the room is already created we join the current client to the room by adding its socket to the collection of sockets associated to the given room (rooms[room_id] is an array of sockets).
            userIds[currentRoom] += 1;
            id = userIds[currentRoom];

      //when a client connects to given room we notify all other peers associated to the room about the newly connected peer.

    //We also have a callback (fn), which we invoke with the client's ID and the room's id, once the client has successfully connected.
            fn(currentRoom, id);
            room.forEach(function (s) {
              s.emit('peer.connected', { id: id });
            });
            room[id] = socket;
            console.log('Peer connected to room', currentRoom, 'with #', id);
          }
        });

    //The msg event is an SDP message or ICE candidate, which should be redirected from specific peer to another peer:
        socket.on('msg', function (data) {
    //The id of given peer is always an integer so that's why we parse it as first line of the event handler. 
          var to = parseInt(data.to, 10);
          if (rooms[currentRoom] && rooms[currentRoom][to]) {
            console.log('Redirecting message to', to, 'by', data.by);
    //After that we emit the message to the specified peer in the _to property of the event data object.
            rooms[currentRoom][to].emit('msg', data);
          } else {
            console.warn('Invalid user');
          }
        });
        
        //the disconnect handler
        socket.on('disconnect', function () {
          if (!currentRoom || !rooms[currentRoom]) {
            return;
          }
          //Once given peer disconnects from the server (for example the user close his or her browser or refresh the page), we remove its socket from the collection of sockets associated with the given room (the delete operator usage).
          delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
          rooms[currentRoom].forEach(function (socket) {
            if (socket) {
              // After that we emit peer.disconnected event to all other peers in the room, with the id of the disconnected peer. This way all peers connected to the disconnected peer will be able to remove the video element associated with the disconnected client.
              socket.emit('peer.disconnected', { id: id });
            }
          });
        });

});




app.post('/savingDocumentsToDatabase', function(req,res) {
    var doc = new userDocument({id: req.body.id, title: req.body.title, mode: req.body.mode, displayName: req.body.displayName, code: req.body.code}); 
    doc.save(function() {});
});


app.post('/retrievingDocumentsForUser', function(req,res) {
  userDocument.find({displayName: req.body.displayName}, function(err, results){
    res.json(results);
  });
});

//delete works but now I need to update every single document's id to --1. 
app.post('/deleteDocumentsForUser', function(req,res) {
  var idOfDeletedDoc = req.body.id;


  userDocument.find({displayName: req.body.displayName, title: req.body.title}, function(err, result){
    return result;
  }).remove(function(result) {});


//find all the documents the user has made
  userDocument.find({displayName: req.body.displayName}, function(err, results) {
    //iterate through the documents
    for (var i =0; i < results.length; i++) {
      //if the user's document is greater than the id of the document we destroyed.
      if (results[i].id > idOfDeletedDoc) {
        //create a new id which is the id of the document we are currently iterating thorugh - 1.
        var newId = results[i].id - 1;
        //set that document to the  
        userDocument.update({id: results[i].id}, {id: newId}, {}, function (err, numAffected) {});
      }
    }
    //sending this so we can utilize the promise structure from angular $http.post
    res.send({});
  });

});
//content will hold the data from the uploaded file
var content;
//Need to build this function to get around asynchronous behavior.
var sendFileDataToClient = function(data) {
  //send the data from the file to the client. 
  io.emit('fileData', content);
};

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
        sendFileDataToClient(content);

      }
  });
});