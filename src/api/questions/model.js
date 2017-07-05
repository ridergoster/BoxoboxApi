// Init variable
var mongoose = require('mongoose');

// Define users schema
var QuestionSchema = new mongoose.Schema({
  question: {
    type:'String',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answer_left: {
    type:'String',
    required: true
  },
  answer_right: {
    type:'String',
    required: true
  },
  date: {
    type: 'Date',
    required: true
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Question', QuestionSchema);
