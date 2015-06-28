// app/models/mailingList.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var mailingListSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('mailingList', mailingListSchema);