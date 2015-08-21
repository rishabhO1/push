// app/models/event.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    eventName: String,
    Time: String,
    fromDate: String,
    untilDate: String, 
    Description: String,
    mailingListName: String
});

module.exports = mongoose.model('event', eventSchema);