// var app = require('./server');
var passport = require('passport');

var User = require('./userProfile/UserModel').user;
var Skills = require('./database/SkillsModel').skills;

var utils = require('./utils.js');
var userAuthUtil = require('./userProfile/userOAuthUtils');
var userUtils = require('./userProfile/userUtils');
var documentUtils = require('./documents/documentUtils');

var GitHubStrategy = require('passport-github').Strategy;
var config = require('../config.js');

module.exports = function(app) {

  if (app.get('env') === 'production') {
    app.use(utils.forceHTTPS);
  }

  app.all('/*', utils.allowCrossOrigin);

  app.get('/', function(req, res){});

  app.get('/auth/github',
    passport.authenticate('github'),
    function(req, res){
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
    });

  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    //This is the request handler that will be called when they click the log in to get hub. 
    userAuthUtil.directToProfile);

  //The next four lines do not appear to do anything. I will double check, then delete if proven true.
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/account', userAuthUtil.ensureAuthenticated, function(req, res){
    res.json(req.user);
  });

  app.get('/login', userAuthUtil.sendingUserToClient);

  passport.use(new GitHubStrategy({
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_SECRET,
      callbackURL: "http://127.0.0.1:8080/auth/github/callback"
    }, userAuthUtil.setingUserToGlobalProfile));


  app.post('/founduser', function(req, res){
    // console.log('this is teh found user', req.body)
    User.findOne({displayName: req.body.user}, function(err, user){
      if(err){return console.log('no founduser', err)}
      // console.log(user)
      res.json(user)
    })
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
      });
    });
  });

  app.post('/futureskills', function(req, res, next){
    // console.log('this is from futureskills', req.body)
    User.findOne({github: req.body.github}, function(err, user) {
      if(err){
        return next(err);
      }
        for(var key in req.body){
          if (req.body[key] !== req.body.github) {
          user.futureskills[key] = req.body[key];
        }
      user.save(function(err, user){
        if (err){
          return next(err);
        }
      // console.log('this after saving skills', user)   
    
    });
  };
  });
  });

  app.get('/oneuserskill', function(req, res, next){
    // console.log('this is the oneuserskill', req.body)
    User.find(function(err, user){
      if(err){next(err);}
      // console.log('this is the user within', user)
      res.json(user);
    });
  });

  

  app.post('/getFromDatabaseBecausePersonSignedIn', userUtils.getFromDatabaseBecausePersonSignedIn);

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
      console.log('this is ensureAuthenticated', isAuthenticated);
      return next(); }
    res.redirect('/login');
  }

  app.post('/savingDocumentsToDatabase', documentUtils.savingDocumentsToDatabase);

  app.post('/retrievingDocumentsForUser', documentUtils.retrievingDocumentsForUser);

  //delete works but now I need to update every single document's id to --1. 
  app.post('/deleteDocumentsForUser', documentUtils.deleteDocumentsForUser);

  app.post('/api/upload', function(req,res) {
    console.log("success"); 
    res.json({});
  });
  
};
