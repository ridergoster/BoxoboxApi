// Init variable
var controller = require('./controller');
var express = require('express');
var answerRouter = express.Router();
var authController = require('../auth');

// Init route of the router
answerRouter.get('/', authController.isAuthenticated, controller.get);
answerRouter.post('/', authController.isAuthenticated, controller.post);
answerRouter.get('/:id', authController.isAuthenticated, controller.getById);
answerRouter.delete('/:id', authController.isAuthenticated, controller.del);

// export the router
module.exports = answerRouter;
