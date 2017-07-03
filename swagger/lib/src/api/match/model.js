// Init variable
var mongoose = require('mongoose');
var _ = require('lodash');
// Define users schema
var MatchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: 'Boolean',
    required: true,
    default: false
  },
  DateCreated: {
    type: 'Date'
  }
}).index({ user1: 1, user2: 1}, { unique: true });

// Export the Mongoose model
module.exports = mongoose.model('Match', MatchSchema);
