// Init variable
var controller = require('./controller');
var express = require('express');
var questionRouter = express.Router();
var authController = require('../auth');

// Init route of the router
questionRouter.get('/', authController.isAuthenticated, controller.get);
questionRouter.post('/', authController.isAuthenticated, controller.post);
questionRouter.get('/last', authController.isAuthenticated, controller.getLast);
questionRouter.get('/:id', authController.isAuthenticated, controller.getById);
questionRouter.delete('/:id', authController.isAuthenticated, controller.del);

// export the router
module.exports = questionRouter;
