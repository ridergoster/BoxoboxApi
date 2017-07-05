// Load required packages
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var UserModel = require('./users/model');
var settings = require('./settings');

var opts = {};
var tokenExtractor = function() {
  return function(req) {
    var token = "";
    if(req && req.headers.authorization) {
      token = req.headers.authorization;
    } else if (req && req.body.token) {
      token = req.body.token;
    } else if (req.query && req.query.api_key) {
      token = req.query.api_key;
    } else if (req && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    return token;
  };
};

opts.jwtFromRequest = tokenExtractor();
opts.secretOrKey = settings.jwt.auth.secretKey;

passport.use('jwt', new JwtStrategy(opts, function(data, done) {
  if (!data.id) {
    return done(null, false);
  }
  UserModel.findById(data.id, false, function(err, user) {
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
}));

exports.isAuthenticated = passport.authenticate('jwt', { session: false});
