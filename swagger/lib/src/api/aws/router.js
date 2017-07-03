// Init variable
var controller = require('./controller');
var express = require('express');
var awsRouter = express.Router();
var multer  = require('multer');
var settings = require('../settings');

var upload = multer({ dest: settings.aws.path.upload });

var authController = require('../auth');

// Init route of the router
awsRouter.post('/download', controller.download);
awsRouter.post('/upload', authController.isAuthenticated, upload.single('file'), controller.upload);
awsRouter.get('/:userId', authController.isAuthenticated, controller.findByUser);
awsRouter.get('/:userId/:pictureId', authController.isAuthenticated, controller.findOne);
awsRouter.post('/delete', authController.isAuthenticated, controller.deleteImage);
// export the router
module.exports = awsRouter;
