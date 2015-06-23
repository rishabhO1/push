// app/models/mailingList.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var mailingListSchema   = new Schema({
    eventName: String,
    validFrom: String,
    validTo: String,
    Description: String,
    recurrence: String
});

module.exports = mongoose.model('mailingList', mailingListSchema);
