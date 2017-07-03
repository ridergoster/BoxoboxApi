// Init variable
var mongoose = require('mongoose');

// Define users schema
var GradeSchema = new mongoose.Schema({
  note: {
    type: Number,
    min: 0,
    max: 3
  },
  like: {
    type: Boolean,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  DateCreated: {
    type: 'Date'
  }
}).index({ owner: 1, recipe: 1}, { unique: true });

// Export the Mongoose model
module.exports = mongoose.model('Grade', GradeSchema);
