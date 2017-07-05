// Init variable
var controller = require('./controller');
var express = require('express');
var messagesRouter = express.Router();
var authController = require('../auth');

// Init route of the router
messagesRouter.get('/', authController.isAuthenticated, controller.get);
messagesRouter.get('/room/:id', authController.isAuthenticated, controller.getByRoom);
messagesRouter.post('/', controller.post);

// export the router
module.exports = messagesRouter;
