// Init variable
var controller = require('./controller');
var express = require('express');
var alarmRouter = express.Router();
var authController = require('../auth');

// Init route of the router
alarmRouter.get('/', authController.isAuthenticated, controller.get);
alarmRouter.post('/', authController.isAuthenticated, controller.post);
alarmRouter.get('/:id', authController.isAuthenticated, controller.getById);
alarmRouter.delete('/:id', authController.isAuthenticated, controller.del);

// export the router
module.exports = alarmRouter;
