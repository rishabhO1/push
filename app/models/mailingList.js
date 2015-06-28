// app/models/mailingList.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var mailingListSchema   = new Schema({
    eventName: String,
    validFrom: {
        Hours: String,
        Minutes: String,
        Tag: String
    },
    validTo: {
        Hours: String,
        Minutes: String,
        Tag: String
    },
    Description: String,
    recurrence: {
        Period: String,
        Frequency: String
    },
    mailingListName: String
});

module.exports = mongoose.model('mailingList', mailingListSchema);
