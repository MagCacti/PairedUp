var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;

db.on('error', function(err){
  console.log('connection error', err);
});

db.once('open', function(){
  console.log('connect');
});


var userSchema = new Schema({
 displayName: String,
 picture: String,
 github: String,
 futureskills: {
   python: Boolean,
   swift: Boolean,
   java: Boolean,
   android: Boolean,
   ruby: Boolean,
 },
 skills:{ 
   node: Number,
   angular: Number,
   html: Number,
   css: Number, 
   jquery: Number
 },
});

// var messageSchema = new Schema({
//     created: String,
//     text: String,
//     displayName: String,
//     room: String,
// });
// var Message = mongoose.model('Message', messageSchema);
var User = mongoose.model("User", userSchema);

module.exports = {
  user: User
  // messages: Message,

};
