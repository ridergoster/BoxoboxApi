// Init variable
var mongoose = require('mongoose');

// Define users schema
var LuminositySchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  date: {
    type: 'Date',
    required: true
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Luminosity', LuminositySchema);
