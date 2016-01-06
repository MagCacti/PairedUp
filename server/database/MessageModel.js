var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    created: String,
    text: String,
    displayName: String,
    room: String,
});
var Message = mongoose.model('Message', messageSchema);

module.exports = {
    messages: Message
};