// Init variable
var mongoose = require('mongoose');

// Define users schema
var AlarmSchema = new mongoose.Schema({
  startDate: {
    type: 'Date',
    required: true
  },
  endDate: {
    type: 'Date',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sensor: {
    type: 'String',
    enum: ['TEMPERATURE', 'LUMINOSITY', 'NOISE']
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Alarm', AlarmSchema);
