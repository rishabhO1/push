// app/models/event.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    eventName: String,
    Time: Date,
    fromDate: Date,
    untilDate: Date, 
    Description: String,
    mailingListName: String
});

module.exports = mongoose.model('event', eventSchema);