// Init variable
var controller = require('./controller');
var express = require('express');
var reportRouter = express.Router();
var authController = require('../auth');

// Init route of the router
reportRouter.get('/', authController.isAuthenticated, controller.get);
reportRouter.post('/', authController.isAuthenticated, controller.post);
reportRouter.delete('/:id', authController.isAuthenticated, controller.del);
reportRouter.delete('/user/:id', authController.isAuthenticated, controller.delUser);
reportRouter.delete('/recipe/:id', authController.isAuthenticated, controller.delRecipe);
reportRouter.get('/:id', authController.isAuthenticated, controller.getById);

// export the router
module.exports = reportRouter;
