// Init variable
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define users schema
var MessageSchema = new mongoose.Schema({
  username: {
    type:'String',
    required:true
  },
  roomId: {
    type:'String',
    required:true
  },
  date: {
    type:'Date'
  },
  message: {
    type: 'String',
    required: true
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Message', MessageSchema);
