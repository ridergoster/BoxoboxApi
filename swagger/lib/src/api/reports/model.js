// Init variable
var mongoose = require('mongoose');

// Define users schema
var ReportSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isUser: {
    type: 'Boolean',
    defaultsTo: false
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  isRecipe: {
    type: 'Boolean',
    defaultsTo: false
  },
  message: {
    type:'String'
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Report', ReportSchema);
