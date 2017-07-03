// Init variable
var controller = require('./controller');
var express = require('express');
var gradeRouter = express.Router();
var settings = require('../settings');
var authController = require('../auth');

// Init route of the router
gradeRouter.get('/', authController.isAuthenticated, controller.get);
gradeRouter.post('/', authController.isAuthenticated, controller.post);
gradeRouter.put('/:id', authController.isAuthenticated, controller.update);
gradeRouter.delete('/:id', authController.isAuthenticated, controller.del);
gradeRouter.get('/:id', authController.isAuthenticated, controller.getById);
gradeRouter.get('/owner/:id', authController.isAuthenticated, controller.getByOwner);
gradeRouter.get('/recipe/:id', authController.isAuthenticated, controller.getByRecipe);
// export the router
module.exports = gradeRouter;
