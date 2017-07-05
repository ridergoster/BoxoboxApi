// Init variable
var controller = require('./controller');
var express = require('express');
var messagesRouter = express.Router();
var authController = require('../auth');

// Init route of the router
messagesRouter.get('/', authController.isAuthenticated, controller.get);
messagesRouter.post('/', authController.isAuthenticated, controller.post);
messagesRouter.delete('/:id', authController.isAuthenticated, controller.del);

// export the router
module.exports = messagesRouter;
