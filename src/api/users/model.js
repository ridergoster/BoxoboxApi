// Init variable
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define users schema
var UserSchema = new mongoose.Schema({
  email: {
    type:'String',
    required:true,
    unique: true
  },
  username: {
    type:'String',
    required:true,
    unique: true
  },
  firstname: {
    type:'String',
    required:false,
    defaultsTo: ''
  },
  lastname: {
    type: 'String',
    required: false,
    defaultsTo: ''
  },
  gender: {
    type: 'String',
    enum: ['male', 'female']
  },
  password: {
    type: 'String',
    select: false,
    required: true
  },
  admin: {
    type: 'Boolean',
    defaultsTo: false
  }
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {

  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) {
    return callback();
  }

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

// add method function
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// add static function
UserSchema.statics.findUser = function (query, pwd, callback) {
  return this.findOne(query, pwd ? {password: 1} : {password: 0}, callback);
};

UserSchema.statics.findUsers = function (query, pwd, callback) {
  return this.find(query, pwd ? {password: 1} : {password: 0}, callback);
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
