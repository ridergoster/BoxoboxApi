// Init variable
var express = require('express');
var app = express();
var userRouter = require('./users/router');
var recipeRouter = require('./recipes/router');
var awsRouter = require('./aws/router');
var gradeRouter = require('./grades/router');
var matchRouter = require('./match/router');
var reportRouter = require('./reports/router');
var messageRouter = require('./messages/router');

// Init router
app.use('/users', userRouter);
app.use('/recipes', recipeRouter);
app.use('/aws', awsRouter);
app.use('/grades', gradeRouter);
app.use('/match', matchRouter);
app.use('/reports', reportRouter);
app.use('/messages', messageRouter);

// JSON description of all the route of the API
var routesView = {
  user: {
    getAll: '/users',
    post: '/users',
    getUser: '/users/:id'
  },
  recipe: {
    getAll: '/recipes',
    post: '/recipes',
    getRecipe: '/recipes/:id'
  },
  grade: {
    getAll: '/grades',
    post: '/grades'
  },
  aws: {
    download: '/aws/download',
    upload: '/aws/upload'
  },
  match: {
    post: '/match',
    getAll: '/match'
  },
  messages: {
    post: '/messages',
    getAll: '/messages',
    getByRoom: '/messages/room/:id'
  }
};

// show description of all the API
app.get('/', function (req, res) {
  res.send(routesView);
});

// export dashboard API
module.exports = app;
