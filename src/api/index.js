// Init variable
var express = require('express');
var app = express();

var userRouter = require('./users/router');
var temperatureRouter = require('./temperatures/router');
var noiseRouter = require('./noises/router');
var luminosityRouter = require('./luminosities/router');
var questionRouter = require('./questions/router');
var answerRouter = require('./answers/router');
var alarmRouter = require('./alarms/router');
var messageRouter = require('./messages/router');

// Init router
app.use('/users', userRouter);
app.use('/temperatures', temperatureRouter);
app.use('/noises', noiseRouter);
app.use('/luminosities', luminosityRouter);
app.use('/questions', questionRouter);
app.use('/answers', answerRouter);
app.use('/alarms', alarmRouter);
app.use('/messages', messageRouter);

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
  message: {
    getAll: '/messages',
    post: '/messages',
    delete: '/messages/:id'
  },
  question: {
    getAll: '/questions',
    post: '/questions',
    getLast: '/questions/last',
    getOne: '/questions/:id',
    delete: '/questions/:id'
  },
  answer: {
    getAll: '/answers',
    post: '/answers',
    getOne: '/questions/:id',
    delete: '/questions/:id'
  },
  alarm: {
    getAll: '/alarms',
    post: '/alarms',
    getOne: '/alarms/:id',
    delete: '/alarms/:id'
  }
};

// show description of all the API
app.get('/', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(routesView, null, 2));
});

// export dashboard API
module.exports = app;
