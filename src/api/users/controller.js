// Init variable
var UserModel = require('./model');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var settings = require('../settings');

/**
 *
 * @api {get} /api/users request all users
 * @apiGroup Users
 * @apiDescription request all users
 * @apiParam {query} [username] username of user
 * @apiParam {query} [email] email of user
 * @apiParam {query} [gender] male of female
 *
 */
 exports.get = function get(req, res) {
  var research = null;
  if (req.query) {
    research = req.query;
    delete research.api_key;
  }
  UserModel.findUsers(research, false, function(err, users) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else {
      res.json(users);
    }
  });
 };

/**
 *
 * @api {get} /api/users/:id
 * @apiGroup Users
 * @apiDescription request user by id
 * @apiParam {String} id id of the user
 *
 */
exports.getById = function getById(req, res) {
  var id = req.params.id;
  if(req.params.id === 'me') id = req.user._id;
  UserModel.findUser({_id: id}, false, function(err, users) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!users) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      res.json(users);
    }
  });
};

/**
 *
 * @api {post} /api/users
 * @apiGroup Users
 * @apiDescription create a user
 * @apiParam {String} email email of the User.
 * @apiParam {String} username username of the User.
 * @apiParam {String} firstname  Optional Firstname of the User.
 * @apiParam {String} lastname  Optional Lastname of the User.
 *
 */
exports.post = function post(req,res) {
  var user = new UserModel();
  _.extend(user,req.body);
  user.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else {
      res.json(user);
    }
  });
};

/**
 *
 * @api {put} /api/users/:id
 * @apiGroup Users
 * @apiDescription update a user
 * @apiParam {String} id id of the user
 * @apiParam {String} email email of the User.
 * @apiParam {String} username username of the User.
 * @apiParam {String} firstname  Optional Firstname of the User.
 * @apiParam {String} lastname  Optional Lastname of the User.
 *
 */
exports.update = function update(req, res) {
  var id = req.params.id;
  if(id === "me") id = req.user._id;
  if(!req.user._id.equals(id) && !req.user.admin) {
    return res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  UserModel.findOne({ _id: id }, function (err, user){
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!user) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      var update = req.body;
      if(_.has(update, '_id')) delete update._id;
      if(_.has(update, 'admin')) delete update.admin;
      if(_.has(update, 'password')) delete update.password;
      user = _.extend(user, update);
      user.save(function (err) {
        if(err) {
          res.status(400).send({ error: 'BAD_REQUEST', code: 400});
        }
        else {
          res.json(user);
        }
      });
    }
  });
};

/**
 *
 * @api {delete} /api/users/:id
 * @apiGroup Users
 * @apiDescription delete a user
 * @apiParam {String} id id of the user
 *
 */
exports.del = function del(req, res) {
  if(!req.user._id.equals(req.params.id) && !req.user.admin) {
    return res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  UserModel.findOneAndRemove({ _id: req.params.id }, function (err, user){
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!user) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      res.json(user);
    }
  });
};

/**
 *
 * @api {post} /api/users/login
 * @apiGroup Users
 * @apiDescription login a user
 * @apiParam {String} email or username of the User.
 * @apiParam {String} password of the User.
 *
 */
exports.login = function login(req,res) {
  var connexion = req.body;
  var query = {};
  if( (_.isEmpty(_.get(connexion, 'username')) && _.isEmpty(_.get(connexion, 'email'))) || _.isEmpty(_.get(connexion, 'password'))) {
    return res.status(422).send({ error: 'MISSING_PARAMETERS', code: 422});
  }
  if(_.has(connexion, 'username') && !_.isEmpty(connexion.username)) {
    query.username = connexion.username;
  }
  else if(_.has(connexion, 'email') && !_.isEmpty(connexion.email)) {
    query.email = connexion.email;
  }
  UserModel.findUser(query, true, function(err, user) {
    if (err){
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if(!user) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      var validPwd = bcrypt.compareSync(connexion.password, user.password);
      if(validPwd === true) {
        var token = jwt.sign(
          {
            id: user.id
          },
          settings.jwt.auth.secretKey,
          {
            expiresIn: settings.jwt.auth.expiresIn
          }
        );
        res.send({token:token});
      }
      else {
        res.status(400).send({ error: 'INVALID_PASSWORD', code: 400});
      }
    }
  });
};
