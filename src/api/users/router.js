// Init variable
var controller = require('./controller');
var express = require('express');
var userRouter = express.Router();
var authController = require('../auth');

// Init route of the router
userRouter.get('/', authController.isAuthenticated, controller.get);
userRouter.post('/', controller.post);
userRouter.put('/:id', authController.isAuthenticated, controller.update);
userRouter.delete('/:id', authController.isAuthenticated, controller.del);
userRouter.get('/:id', authController.isAuthenticated, controller.getById);
userRouter.post('/login', controller.login);

// export the router
module.exports = userRouter;
