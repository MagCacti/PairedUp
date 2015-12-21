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
 github: String
 
});

var messageSchema = new Schema({
    nameOfChat: String, 
    messageContent: String
});


var Message = mongoose.model('Messages', messageSchema);
var User = mongoose.model("User", userSchema);


module.exports = {
    user: User,
    messages: Message
};