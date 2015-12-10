var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Line 5 or line 10. Not both. 
/*mongodb:// username:password@ hostname:port/ database
*/

// Since you're connecting to a local instance, you can skip the username and password and use the following URI:

var uri = 'mongodb://localhost/users' || 'mongodb://username:password@ds061954.mongolab.com:61954/heroku_z1qhwknn';
var db = require('mongoose').connect(uri);

var userSchema = new Schema({
 username: String, // from Github
 name: String,
 picture: String // from Github
 // lastname: String,
 // password: String, 
 // officeHours: String,
 // angular: String, 
 // node: String, 
 // javascript: String, 
 // skill: String,
 // interest: String
});

var messageSchema = new Schema({
 chatName: String,
 chatContent: String //we could optimize this with a key-store database which would return info in constant time.
});

// userSchema.methods.speak = function () {
//  var greeting = this.username? "Meow name is " + this.username: "I don't have a name";
//  console.log(greeting);
// }

var Message = mongoose.model("Message", userSchema);
var User = mongoose.model("User", userSchema);

// var Joseph = new User({
//  username: "JosephSun",
//  firstname: "Bazz",
//  lastname: "Khurshid",
//  password: "YouKnowz", 
//  officeHours: "9-10",
//  angular: "65", 
//  node: "70", 
//  javascript: "80", 
//  interest: "Databases, Augmented reality, Big Data"
// });

// console.log("Joseph is speaking",Joseph.speak());
// Joseph.save(function (err, Joseph) {
//   if (err) return console.error(err);
//   console.log("This is joseph", Joseph);
//   Joseph.speak();
// });

module.exports = {
  user: User,
  messages: Message
};

// To access the database via the command line when on localhost:
// .....$ mongo
// .....$ show databases
// .....$ show db.users     // or show db.messages
// .....$ show collections
// .....$ use messages // or use users
// .....$ 
