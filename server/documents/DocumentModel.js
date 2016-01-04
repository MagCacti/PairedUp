var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema ({
    id: Number, 
    title: String, 
    mode: String,
    displayName: String, 
    code: String,
    room: String,
});

var Document = mongoose.model('Document', documentSchema);

module.exports = {
  userDocument: Document,
};