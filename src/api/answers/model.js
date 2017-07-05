// Init variable
var mongoose = require('mongoose');

// Define users schema
var AnswerSchema = new mongoose.Schema({
  answer: {
    type:'String',
    enum: ['LEFT', 'RIGHT'],
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: 'Date',
    required: true
  }
}).index({ question: 1, user: 1}, { unique: true });

// Export the Mongoose model
module.exports = mongoose.model('Answer', AnswerSchema);
