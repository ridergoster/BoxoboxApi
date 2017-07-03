// Init variable
var express = require('express');
var bodyParser = require('body-parser');
var swaggerUiMiddleware = require('swagger-ui-middleware');
var app = express();
var passport = require('passport');

// Using json parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Using passport to initialize a safe connexion
app.use(passport.initialize());

// Adding the documentation
swaggerUiMiddleware.hostUI(app);
swaggerUiMiddleware.hostUI(app, {path: '/swagger', source: '/swagger', overrides: 'swagger' });

// Create documentation (require swagger)
app.get('/doc', function get(req, res) {
  res.setHeader("Access-Control-Allow-Headers", "x-requested-with, Content-Type");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Atmosphere-tracking-id, X-Atmosphere-Framework, X-Cache-Date, Content-Type, X-Atmosphere-Transport, *');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Request-Headers', 'Origin, X-Atmosphere-tracking-id, X-Atmosphere-Framework, X-Cache-Date, Content-Type, X-Atmosphere-Transport,  *');
  var data = require('./swagger.json');
  res.json(data);
});

// Export server to home
module.exports = app;
