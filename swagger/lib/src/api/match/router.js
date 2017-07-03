// Init variable
var controller = require('./controller');
var express = require('express');
var matchRouter = express.Router();
var settings = require('../settings');
var authController = require('../auth');

// Init route of the router
matchRouter.get('/', authController.isAuthenticated, controller.get);
matchRouter.get('/:id', authController.isAuthenticated, controller.getById);
matchRouter.delete('/:id1/:id2', authController.isAuthenticated, controller.del);
matchRouter.get('/user/:id', authController.isAuthenticated, controller.getByUserId);
matchRouter.post('/:id', authController.isAuthenticated, controller.post);

// export the router
module.exports = matchRouter;
