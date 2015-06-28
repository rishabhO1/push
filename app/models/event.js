// app/models/event.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    eventName: String,
    Description: String,
    eventListName: String
});

module.exports = mongoose.model('event', eventSchema);