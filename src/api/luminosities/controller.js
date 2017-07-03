// Init variable
var mongoose = require('mongoose');
var LuminosityModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/luminosities
 * @apiGroup Luminosities
 * @apiDescription request all luminosities record
 * @apiParam {query} [after] date you want record to be after
 * @apiParam {query} [before] date you want record to be before
 * @apiParam {query} [orderDate] order results by date [ASC, DESC]
 *
 */
exports.get = function(req, res) {
  var research = {};
  var sort = {'date': -1};
  if (_.has(req.query, 'orderDate')) {
    sort.date = req.query.orderDate === 'ASC' ? 1 : -1;
  }

  if (_.has(req.query, 'before')) {
    _.defaultsDeep(research, { 'date': { '$lt': new Date(req.query.before) } });
  }
  if (_.has(req.query, 'after')) {
    _.defaultsDeep(research, { 'date': { '$gte': new Date(req.query.after) } });
  }

  LuminosityModel.find(research)
  .sort(sort)
  .exec(function(err, luminosities) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(luminosities);
      }
    })
  ;
};

/**
 *
 * @api {post} /api/luminosities
 * @apiGroup Luminosities
 * @apiDescription create a luminosity
 * @apiParam {Number} value luminosity measure
 * @apiParam {Date} date date of the measure
 *
 */
exports.post = function post(req,res) {
  var luminosity = new LuminosityModel();
  luminosity.date = new Date();
  _.extend(luminosity, req.body);
  luminosity.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      LuminosityModel.findOne({_id: luminosity._id})
        .exec(function(err, resLuminosity) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resLuminosity) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resLuminosity);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {get} /api/luminosities/last
 * @apiGroup Luminosities
 * @apiDescription get the last measure
 *
 */
exports.getLast = function getLast(req, res) {
  LuminosityModel.findOne()
  .sort({date: -1}).exec(function(err, luminosity) {
    if (err){
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!luminosity) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      res.json(luminosity);
    }
  });
}

/**
 *
 * @api {get} /api/luminosities/:id
 * @apiGroup Luminosities
 * @apiDescription request luminosity by id
 * @apiParam {String} id id of the luminosity
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  LuminosityModel.findOne({_id: id})
    .exec(function(err, luminosity) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!luminosity) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(luminosity);
      }
    })
  ;
};

/**
 *
 * @api {delete} /api/luminosities/:id
 * @apiGroup Luminosities
 * @apiDescription delete a luminosity
 * @apiParam {String} id id of the luminosity
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  LuminosityModel.findOne({ _id: id }, function (err, luminosity) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!luminosity) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      LuminosityModel.findOneAndRemove({ _id: id })
        .exec(function (err, resLuminosity) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resLuminosity) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resLuminosity);
          }
        })
      ;
    }
  });
};
