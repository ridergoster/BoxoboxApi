// Init variable
var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

// Define users schema
var RecipeSchema = new mongoose.Schema({
  name: {
    type:'String',
    required:true
  },
  url: {
    type: 'String',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type:'String'
  },
  type: {
    type: 'String',
    enum: [null, 'salt', 'sweet']
  },
  dish: {
    type: 'String',
    enum: [null, 'entrance','main','dessert']
  },
  steps: {
    type: 'String'
  }
});
RecipeSchema.plugin(random);

// Export the Mongoose model
module.exports = mongoose.model('Recipe', RecipeSchema);
