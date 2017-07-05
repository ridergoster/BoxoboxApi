// Init variable
var controller = require('./controller');
var express = require('express');
var noiseRouter = express.Router();
var authController = require('../auth');

// Init route of the router
noiseRouter.get('/', authController.isAuthenticated, controller.get);
noiseRouter.post('/', authController.isAuthenticated, controller.post);
noiseRouter.get('/last', authController.isAuthenticated, controller.getLast);
noiseRouter.get('/:id', authController.isAuthenticated, controller.getById);
noiseRouter.delete('/:id', authController.isAuthenticated, controller.del);

// export the router
module.exports = noiseRouter;
