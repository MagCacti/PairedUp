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
 chatroom: [{roomname:String, chatwith:String}],
 messages:[{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
 privaterooms:[{type: mongoose.Schema.Types.ObjectId, ref: 'PrivateRooms'}]
});

var privateroomsSchema = new Schema({
	fromUser: String,
	toUser: String,
	roomName: String,
	otherName: String,
	messages:[{ 
		created: String,
    	text: String,
    	displayName: String,
    }]
})

var messageSchema = new Schema({
    created: String,
    text: String,
    displayName: String,
    room: String,

});


// var Document = mongoose.model('Document', documentSchema);
var Message = mongoose.model('Message', messageSchema);
// var Skills = mongoose.model("Skills", skillsSchema);
var User = mongoose.model("User", userSchema);
var PrivateRooms = mongoose.model("PrivateRooms", privateroomsSchema);



module.exports = {
  user: User,
  messages: Message,
  privaterooms : PrivateRooms
    // userDocument: Document,
    // skills: Skills
};


