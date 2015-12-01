var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var menteeSchema = new Schema({
  name: String,
  interest: String
  // placeholder
  // placeholder
  // placeholder
  // placeholder
  // placeholder
  // placeholder
  // placeholder

});


var mentorSchema = new Schema({
  name: String,
  skill: String,
  locaton: String
  // placeholder 
  // placeholder 
  // placeholder 
  // placeholder 
  // placeholder 
  // placeholder 
  // placeholder 

});

var Mentee = mongoose.model('Mentee', menteeSchema);

var Mentor = mongoose.model('Mentor', mentorSchema);



