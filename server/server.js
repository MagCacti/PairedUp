var express = require('express');
var qs = require('querystring');
var bodyParser = require('body-parser');
// var favicon = require('express-favicon');
// var favicon = require('serve-favicon');
var fs = require('fs');
//Need if we want to check req.file; 
var multer  = require('multer');
var cookieParser = require('cookie-parser');
// var cors = require('cors');
var request = require('request');
// var jwt = require('jwt-simple');
// var moment = require('moment');
var utils = require('./utils.js');
var documentUtils = require('./documents/documentUtils');
var userAuthUtil = require('./userProfile/userOAuthUtils');
var socketUtils = require('./socketUtils');
var userUtils = require('./userProfile/userUtils');

var path = require('path');
var config = require('../config.js');

var mongoose = require('mongoose');
var uri = config.MONGO_URI; 
mongoose.connect(uri);

var app = express();
var http = require('http');
var server = http.Server(app);
var passport = require('passport');
var flash    = require('connect-flash');
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var morgan = require('morgan');
var uuid = require('node-uuid');
var rooms = {};
var userIds = {};
//I believe we need if we want to check req.file
var upload = multer({ dest: 'uploads/' });

var socketio = require('socket.io');
var io = socketio(server);
server.listen(8080); 
console.log("App listening on port 8080");

var User = require('./userProfile/UserModel').user;
var Skills = require('./database/SkillsModel').skills;
var Messages = require('./database/MessageModel').messages;
var PrivateRooms = require('./userProfile/UserModel').privaterooms;


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
  app.use(utils.forceHTTPS);
}

//to allow cross origin (need to add more to this comment.)
app.all('/*', utils.allowCrossOrigin);

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
  userAuthUtil.directToProfile);

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

app.post('/founduser', function(req, res){
  console.log('this is teh found user', req.body)
  User.findOne({displayName: req.body.user}, function(err, user){
    if(err){return console.log('no founduser', err)}
    console.log(user)
    res.json(user)
  })
})

app.get('/login', userAuthUtil.sendingUserToClient);

app.get('/oneuserskill', function(req, res, next){
  console.log('this is the oneuserskill', req.body)
  User.find(function(err, user){
    if(err){next(err);}
    console.log('this is the user within', user)
    res.json(user);
  });
});

app.post('/skills', function(req, res, next) {
  // console.log('this is from skills', req.body)
  User.findOne({github: req.body.github}, function(err, user) {
  // console.log('this is from skills', user)
    if(err){return next(err)}
      for(var key in req.body){
        if (req.body[key] !== req.body.github)
        user.skills[key] = req.body[key]
      }
    user.save(function(err, user){
      if (err){return next(err)}
    // console.log('this after saving first skills', user)   
    })
  })
});

app.post('/futureskills', function(req, res, next){
  // console.log('this is from futureskills', req.body)
  User.findOne({github: req.body.github}, function(err, user) {
    if(err){return next(err)}
      for(var key in req.body){
        if (req.body[key] !== req.body.github)
        user.futureskills[key] = req.body[key]
      }
    user.save(function(err, user){
      if (err){return next(err)}
    // console.log('this after saving skills', user)   
    })
  })
})

//if the person is signed in and goes back to the profile page
app.post('/getFromDatabaseBecausePersonSignedIn', userUtils.getFromDatabaseBecausePersonSignedIn);


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
  }, userAuthUtil.setingUserToGlobalProfile));



//The first event we will use is the connection event. It is fired when a client tries to connect to the server; Socket.io creates a new socket that we will use to receive or send messages to the client  
  // var people = {};  
  // var chatroom = {}; 
  // var clients = [];
io.on('connection', function(socket) {
  var roomname;
  console.log('new connection');
  socket.on('writeToUser', function(data){
    // console.log('this the write to user data', data)
    roomname = data.fromUser+data.toUser
    socket.join(roomname)
    User.findOne({displayName:data.toUser}, function(err, user){
      if(err){return console.log('could not find the useryou wanted to write to',err )}
        user.chatroom.push({roomname:roomname, chatwith:data.fromUser})
      user.save(function(err, results){
        if(err){return console.log('you didnt save a chatroom'), err}
        // console.log('you saved the chatroom', results)
      })
    })
    User.findOne({displayName:data.fromUser}, function(err, user){
      if(err){return console.log('could not find the useryou wanted to write to',err )}
        user.chatroom.push({roomname:roomname, chatwith:data.toUser})
      user.save(function(err, results){
        if(err){return console.log('you didnt save a chatroom'), err}
        // console.log('you saved the chatroom', results)
      })
    })
      socket.emit('roomlist', {roomname: roomname})
      socket.emit('composeToUser', data)
  })
  
  socket.on('userjoin', function(data){
    socket.join(data.joinedroom)
    socket.broadcast.to(data.joinedroom).emit('joincomplete', console.log('hey your in this chat with ' +data.chatwith))
    socket.emit('replychat', data) 
  })


    // socket.on('makeroom', function(data){
    //   // var id = uuid.v4();
    //   roomname = data.fromUser+data.toUser
    //   othername = data.toUser+data.fromUser
    //   var chatroom = new PrivateRooms();
    //   chatroom.toUser = data.fromTo
    //   chatroom.fromUser = data.fromUser
    //   chatroom.roomName = roomname
    //   chatroom.otherName = othername
    //   chatroom.save(function(err, results){
    //     if(err){return console.log('you errored out in making a room', err)}
    //     console.log('you this is the new room you just made', results)
    //   })


    //   User.findOne({displayName:data.fromUser}, function(err, user){
    //     if(err){return;}
    //     user.privaterooms.push(chatroom)
    //     user.save(function(err, results){
    //       if(err){return console.log('you have an err saving to rooms to users', err)}
    //       console.log('you successfully saved this room to the user', results)
    //     })
    //   })
    //   User.findOne({displayName:data.toUser}, function(err, user){
    //     if(err){return;}
    //     user.privaterooms.push(chatroom)
    //     user.save(function(err, results){
    //       if(err){return console.log('you have an err saving to rooms to users', err)}
    //       console.log('you successfully saved this room to the user', results)
    //     })
    //   })
    //       // chatroom[id] = room;
    //   // socket.emit("roomList", {fromUser: chatroom});
    //   console.log('this is data recieved from client contacts controller', data)
    //   // chatroom['privateChat'] = data.roomname;
    //   // people['creator'] = data.creator;
    //   socket.join(data.roomname)
    //   // room.addPerson(data.creator)
    //   // socket.on(data.roomname, function(data){
    //   //   socket.broadcast.emit('/roomcreated', 'created a room here')
    //   // })
    // })

  socket.on('new message', function(message) {
      //message - data from the cliet side 
      console.log('this is the incoming message', message);
    if(joinedroom = undefined){
    roomname = message.fromUser+message.toUser
    } else if(joinedroom) {
      roomname = joinedroom
    } 

    othername = message.toUser+message.fromUser

    PrivateRooms.findOne({roomName:roomname, otherName:othername}, function(err, activeroom){
      console.log('this is the activeroom', activeroom)
      console.log('this is roomname', roomname)
      if(activeroom = '[]') {
        if(roomname===undefined)
          roomname = othername
        var chatroom = new PrivateRooms();
        chatroom.toUser = message.toUser
        chatroom.fromUser = message.fromUser
        chatroom.roomName = roomname
        chatroom.otherName = othername
        chatroom.messages.push({created: message.date, text: message.text, displayName:message.fromUser})
        chatroom.save(function(err, results){
          if(err){return console.log('you errored out in making a room', err)}
          console.log('this is the new room you just made & saved', results)
          io.emit('publish message', results);
        })
      } else if (activeroom.roomname === roomname) {
        console.log('the active room', activeroom)
        activeroom.messages.push({created: message.date, text: message.text, displayName:message.fromName})
                  io.emit('publish message', results);
        // activeroom.save(function(err, results) {
        //   if(err){return console.log('error saving to activeroom', err)}
        //   console.log('cool you saved to the activeroom')

        // })
      }
    });


    //     // User.findOne({displayName:message.fromUser}, function(err, user){
    //     //   if(err){return console.log('this is hte fromuser', user)}
          
    //     //   // user.privaterooms.push(chatroom)
    //     //   user.save(function(err, results){
    //     //     if(err){return console.log('you have an err saving to rooms to users', err)}
    //     //     console.log('you successfully saved this room to the user', results)
    //     //   })
    //     // })
    //     // User.findOne({displayName:messages.toUser}, function(err, user){
    //     //   if(err){return console.log('cant find the toUser', user)}
    //     //   // user.privaterooms.push(chatroom)
    //     //   user.save(function(err, results){
    //     //     if(err){return console.log('you have an err saving to rooms to users', err)}
    //     //     console.log('you successfully saved this room to the user', results)
    //     //   })
    //     // })

    //     // messages.find(function(err, msg){
    //     //   if(err){
    //     //     return console.log('you have an err get chats from the DB', err);
    //     //   }
    //     //   // console.log('MESSAGES from get request', req)
    //     //   foundMessages = msg;
    //     //   //this will post all the messages from the database
    //     //   // io.emit('publish message', foundMessages);
    //     // });
  
    //   }else{

    //     console.log('we found the room', activeroom)

    //     var messages = new Messages(message);
    //     //messages.create etc were all defined in the messages model
    //     messages.created = message.date ;
    //     messages.text = message.text;
    //     messages.displayName = message.fromName;
    //     //messages.roomname 
    //     messages.save(function(err, results){
    //       if(err){
    //         console.log('you have an error', err);
    //       }
    //       console.log('you save the chat. check mongo.', results);
    //       chatroom.messages.push(results)
    //        // io.emit('publish message', results);
    //     });

    //     // messages.find(function(err, msg){
    //     //   if(err){
    //     //     return console.log('you have an err get chats from the DB', err);
    //     //   }
    //     //   // console.log('MESSAGES from get request', req)
    //     //   foundMessages = msg;
    //     //   //this will post all the messages from the database
    //     //   io.emit('publish message', foundMessages);
    //     // });

    //   }



    //   PrivateRooms.find({roomName : roomname}, function(err, msg){
    //     if(err){
    //       return console.log('you have an err get chats from the DB', err);
    //     }
    //     console.log('MESSAGES from get request', msg)
    //     foundMessages = msg;
    //     //this will post all the messages from the database
    //     io.emit('publish message', foundMessages);
    //   });

    // })
 
      // var messages = new Messages(message);
      // //messages.create etc were all defined in the messages model
      // messages.created = message.date ;
      // messages.text = message.text;
      // messages.displayName = message.username;
      // //messages.roomname 
      // messages.save(function(err, results){
      //   if(err){
      //     console.log('you have an error', err);
      //   }
      //   console.log('you save the chat. check mongo.', results);
      // });
      //   ///Collect all the messages now in database 
      //   var foundMessages;
      //   Messages.find(function(err, msg){
      //     if(err){
      //       return console.log('you have an err get chats from the DB', err);
      //     }
      //     // console.log('MESSAGES from get request', req)
      //     foundMessages = msg;
      //     //this will post all the messages from the database
      //     io.emit('publish message', foundMessages);
      //   });


///////end of newmessage socket//////     
    });
///////end of newmessage socket//////  
//general code
  //PROBLEM: As it stands I cannot use the socketUtils file here because Socket will be undefined in that file.
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

  socket.on('init', /*socketUtils.init*/ function (data, fn) {
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
  socket.on('msg', socketUtils.msg);
        
        //the disconnect handler
  //PROBLEM: As it stands I cannot use the socketUtils file here because Socket will be undefined in that file.
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


app.post('/savingDocumentsToDatabase', documentUtils.savingDocumentsToDatabase);


app.post('/retrievingDocumentsForUser', documentUtils.retrievingDocumentsForUser);

//delete works but now I need to update every single document's id to --1. 
app.post('/deleteDocumentsForUser', documentUtils.deleteDocumentsForUser);
//content will hold the data from the uploaded file
var content;
//Need to build this function to get around asynchronous behavior.
var sendFileDataToClient = function(data) {
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
    }
  });
});