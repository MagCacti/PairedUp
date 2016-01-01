var config = require('../../config.js');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var db = require('./UserModel');
var User = db.user;
var globalProfile; 
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = {
    passportAuthenticate: passport.authenticate('github'), 
    directToProfile : function (req, res) {
      res.redirect('http://localhost:8080/#/profile');
    },
    sendingUserToClient: function(req, res){
      // var count = 0;
      // var passportObject;
      // for (var key in req.sessionStore.sessions) {
      //   count++; 
      //   if (count === 2) {
      //     passportObject = req.sessionStore.sessions[key];
      //     break;
      //   }
      // }
      // var userInformation = passportObject.split('passport')[1].split(':');
      // console.log("UserInfo", passportObject.split('passport')[1]);
      // // console.log("userInformation", userInformation);
      // console.log("userInformation14", userInformation[14]);
      // console.log("userInformation15", userInformation[15]);
      // var id = userInformation[3].split(',')[0].split("\"")[1];
      // var displayName = userInformation[5].split(',')[0].split("\"")[1];
      // var avatarUrl = "https:" + userInformation[15].split(',')[0];
      // avatarUrl[avatarUrl.length - 1] = '';
      // avatarUrl = avatarUrl.split('');
      // // console.log("avatarUrl", avatarUrl);
      // var modifiedAvatarUrl = '';
      // for (var j = 0; j < avatarUrl.length; j++) {
      //   if (j < avatarUrl.length -2 ) {
      //     modifiedAvatarUrl += avatarUrl[j];
      //   }
      // }


      // var userProfile = {github: id, picture: modifiedAvatarUrl, displayName: displayName};
      // console.log( "globalProfile", globalProfile, "userProfile", userProfile);
      res.json({profile: globalProfile, sessions: req.session});
    },
    ensureAuthenticated : function(req, res, next) {
      if (req.isAuthenticated()) { 
        console.log('this is ensureAuthenticated', isAuthenticated);
        return next(); 
      }
      res.redirect('/login');
    },
    setingUserToGlobalProfile:   function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({github: profile.id}, function (err, user) {
          if (user) {
          globalProfile = user;
          }else {
            var user = new User();
            user.github = profile.id;
            user.picture = profile._json.avatar_url;
            user.displayName = profile.displayName;
            user.save(function() {});
            globalProfile = user;
          }
        });
        return done(null, profile);
      });
    }
};