// app/models/event.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    eventName: String,
    Time: String,
    validFrom: String,
    validTo: String, 
    Description: String,
    eventListName: String
});

module.exports = mongoose.model('event', eventSchema);