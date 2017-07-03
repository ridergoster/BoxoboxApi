// Init variable
var controller = require('./controller');
var express = require('express');
var recipeRouter = express.Router();
var authController = require('../auth');

// Init route of the router
recipeRouter.get('/', authController.isAuthenticated, controller.get);
recipeRouter.get('/random', authController.isAuthenticated, controller.getRandom);
recipeRouter.post('/', authController.isAuthenticated, controller.post);
recipeRouter.put('/:id', authController.isAuthenticated, controller.update);
recipeRouter.delete('/:id', authController.isAuthenticated, controller.del);
recipeRouter.get('/:id', authController.isAuthenticated, controller.getById);
recipeRouter.get('/owner/:id', authController.isAuthenticated, controller.getByOwner);

// export the router
module.exports = recipeRouter;
