var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  username: String,
  fullName: String,
  rollNo: String,
  password: String,
  email: String,
  contact: Number,
  mailingLists: [String]
});

module.exports = mongoose.model('User', userSchema);
