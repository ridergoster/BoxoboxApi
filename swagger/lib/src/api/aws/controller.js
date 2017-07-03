// Init variable
var AWS = require('aws-sdk');
var fs = require('fs-extra');
var path = require('path');
var mime = require('mime');
var settings = require('../settings');
var request = require('request');
var _ = require('lodash');

AWS.config = settings.aws.config;

var s3Bucket = new AWS.S3(settings.aws.s3);

/**
 *
 * @api {post} /api/aws/download
 * @apiGroup Aws
 * @apiDescription download image from uri
 *
 */
exports.download = function download(req, res) {
  if(!req.body.url) {
    res.status(400).send('ERROR_URL_MISSING');
  }
  var url = req.body.url;
  var filename = url.split("/")[url.split("/").length-1];
  var params = {
    Bucket: settings.aws.s3.params.Bucket, /* required */
    Key: url, /* required */
  };
  s3Bucket.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.send(err);
    }
    else {
      res.send(data);
    }
  });
};

/**
 *
 * @api {post} /api/aws/upload
 * @apiGroup Aws
 * @apiDescription upload image from form-data file
 *
 */
exports.upload = function upload(req, res) {
  if(!req.file) {
    res.status(400).send('ERROR_FILE_MISSING');
  }
  var file = req.file;
  console.log(file);
  var stream = fs.createReadStream(file.path);
  var uri = path.join('image', req.user.id,  file.filename + '.' + mime.extension(file.mimetype));
  s3Bucket.upload({
    Key: uri,
    Body: stream,
    ContentType: file.mimetype
  })
  .on('httpUploadProgress', function() {
    // console.log('httpUploadProgress', evt);
    // Log in socket room of upload
  })
  .on('error', function(err) {
    res.send('err');
  })
  .send(function(err, data) {
    if (err) {
      res.send('err');
    }
    var url = 'https://s3-' + settings.aws.s3.region +  '.amazonaws.com/' + settings.aws.s3.params.Bucket + '/' + uri;
    fs.unlink(file.path);
    res.send({url: url});
  });
};

/**
 *
 * @api {post} /api/aws/delete
 * @apiGroup Aws
 * @apiDescription delete image in aws
 * @apiParam {String} uri uri of the image
 *
 */
exports.deleteImage = function deleteImage(req, res) {
  if(_.isEmpty(_.get(req.body, 'uri'))) {
    return res.status(422).send({error: 'MISSING_PARAMETERS', code:422});
  }
  var params = {
    Key: req.body.uri
  };
  s3Bucket.deleteObject(params, function(err, data) {
    if(err) {
      return res.status(400).send({error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      return res.send(data);
    }
  });
};

/**
 *
 * @api {get} /api/aws/:userId
 * @apiGroup Aws
 * @apiDescription find all user images
 * @apiParam {String} userId id of the user
 *
 */
exports.findByUser = function findByUser(req, res) {
  var userId = req.params.userId;
  if(userId === 'me') userId = req.user._id;
  var s3 = new AWS.S3();
  var params = {
    Marker: 'image/' + userId +'/'
  };
  s3Bucket.listObjects(params, function (err, data) {
    if(err)throw err;
    res.send(data.Contents);
  });
};

/**
 *
 * @api {get} /api/aws/:userId/:pictureId
 * @apiGroup Aws
 * @apiDescription find an image
 * @apiParam {String} userId id of the user
 * @apiParam {String} pictureId id of the picture
 *
 */
exports.findOne = function findOne(req, res) {
  var userId = req.params.userId;
  var pictureId = req.params.pictureId;
  var s3 = new AWS.S3();
  var params = {
    Marker: 'image/' + userId +'/'
  };
  s3Bucket.listObjects(params, function (err, data) {
    if(err)throw err;
    data.Contents.forEach(function(data) {
      if(data.Key.indexOf(pictureId) > -1) {
        res.send(data);
      }
    });
    res.status(404).send('Picture not found');
  });
};
