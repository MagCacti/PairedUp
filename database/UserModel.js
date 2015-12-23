var mongoose = require('mongoose');
var config = require('../config.js');
var Schema = mongoose.Schema;

//Line 5 or line 10. Not both. 
/*mongodb:// username:password@ hostname:port/ database
*/

// Since you're connecting to a local instance, you can skip the username and password and use the following URI:


var uri = config.MONGO_URI; 
mongoose.connect(uri);

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
 skills:[{type: mongoose.Schema.Types.ObjectId, ref: 'Skills'}],
 messages:[{type: mongoose.Schema.Types.ObjectId, ref: 'Messages'}]
 
});

 //this method would probably be best suited for our messages where skills would be messages
 //and the 

var skillsSchema = new mongoose.Schema({
  node: Number,
  angular: Number,
  html: Number,
  css: Number, 
  jquery: Number,
  userid: { type: Number, ref: 'User' }
});

var messageSchema = new Schema({
    created: Date,
    content: String,
    // displayName: {type: String, ref: 'User'},
    room: String
});

var documentSchema = new Schema ({
    id: Number, 
    title: String, 
    mode: String,
    displayName: String, 
    code: String
});
// userSchema.methods.speak = function () {
//  var greeting = this.username? "Meow name is " + this.username: "I don't have a name";
//  console.log(greeting);
// }

var Document = mongoose.model('Document', documentSchema);
var Message = mongoose.model('Messages', messageSchema);
var Skills = mongoose.model("Skills", skillsSchema);
var User = mongoose.model("User", userSchema);


module.exports = {
    user: User,
    messages: Message,
    userDocument: Document,
    skills: Skills
};


