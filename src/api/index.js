// Init variable
var express = require('express');
var app = express();
var userRouter = require('./users/router');
var temperatureRouter = require('./temperatures/router');
var noiseRouter = require('./noises/router');
var luminosityRouter = require('./luminosities/router');

// Init router
app.use('/users', userRouter);
app.use('/temperatures', temperatureRouter);
app.use('/noises', noiseRouter);
app.use('/luminosities', luminosityRouter);

// JSON description of all the route of the API
var routesView = {
  user: {
    getAll: '/users',
    post: '/users',
    getUser: '/users/:id'
  },
  temperature: {
    getAll: '/temperatures',
    post: '/temperatures',
    getLast: '/temperatures/last',
    getOne: '/temperatures/:id',
    delete: '/temperatures/:id'
  },
  noise: {
    getAll: '/noises',
    post: '/noises',
    getLast: '/noises/last',
    getOne: '/noises/:id',
    delete: '/noises/:id'
  },
  luminosity: {
    getAll: '/luminosities',
    post: '/luminosities',
    getLast: '/luminosities/last',
    getOne: '/luminosities/:id',
    delete: '/luminosities/:id'
  },
  messages: {
    post: '/messages',
    getAll: '/messages',
    getOne: '/messages/:id'
  }
};

// show description of all the API
app.get('/', function (req, res) {
  res.send(routesView);
});

// export dashboard API
module.exports = app;
