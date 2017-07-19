// Init variable
var controller = require('./controller');
var express = require('express');
var humidityRouter = express.Router();
var authController = require('../auth');

// Init route of the router
humidityRouter.get('/', authController.isAuthenticated, controller.get);
humidityRouter.post('/', authController.isAuthenticated, controller.post);
humidityRouter.get('/last', authController.isAuthenticated, controller.getLast);
humidityRouter.get('/:id', authController.isAuthenticated, controller.getById);
humidityRouter.delete('/:id', authController.isAuthenticated, controller.del);

// export the router
module.exports = humidityRouter;
