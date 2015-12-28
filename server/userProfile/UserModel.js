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
 //this needs to be refactored. it stores a new object of skills everytime you enter a 
 //a new skills
 skills:[{type: mongoose.Schema.Types.ObjectId, ref: 'Skills'}],
 messages:[{type: mongoose.Schema.Types.ObjectId, ref: 'Messages'}]
});

 //this method would probably be best suited for our messages where skills would be messages
 //and the 

// var skillsSchema = new mongoose.Schema({
//   node: Number,
//   angular: Number,
//   html: Number,
//   css: Number, 
//   jquery: Number,
//   userid: { type: Number, ref: 'User' }
// });

// var messageSchema = new Schema({
//     created: String,
//     text: String,
//     displayName: String,
//     room: String,
//     userid: { type: Number, ref: 'User' }
// });

// var documentSchema = new Schema ({
//     id: Number, 
//     title: String, 
//     mode: String,
//     displayName: String, 
//     code: String
// });

// var Document = mongoose.model('Document', documentSchema);
// var Message = mongoose.model('Messages', messageSchema);
// var Skills = mongoose.model("Skills", skillsSchema);
var User = mongoose.model("User", userSchema);


module.exports = {
  user: User
  // messages: Message
    // userDocument: Document,
    // skills: Skills
};


