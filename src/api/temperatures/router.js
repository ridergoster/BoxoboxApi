// Init variable
var controller = require('./controller');
var express = require('express');
var temperatureRouter = express.Router();
var authController = require('../auth');

// Init route of the router
temperatureRouter.get('/', authController.isAuthenticated, controller.get);
temperatureRouter.post('/', authController.isAuthenticated, controller.post);
temperatureRouter.get('/last', authController.isAuthenticated, controller.getLast);
temperatureRouter.get('/:id', authController.isAuthenticated, controller.getById);
temperatureRouter.delete('/:id', authController.isAuthenticated, controller.del);

// export the router
module.exports = temperatureRouter;
