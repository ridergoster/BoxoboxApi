// Init variable
var mongoose = require('mongoose');
var TemperatureModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/temperatures
 * @apiGroup Temperatures
 * @apiDescription request all temperatures record
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

  TemperatureModel.find(research)
  .sort(sort)
  .exec(function(err, temperatures) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(temperatures);
      }
    })
  ;
};

/**
 *
 * @api {post} /api/temperatures
 * @apiGroup Temperatures
 * @apiDescription create a temperature
 * @apiParam {Number} value temperature measure
 * @apiParam {Date} date date of the measure
 *
 */
exports.post = function post(req,res) {
  var temperature = new TemperatureModel();
  temperature.date = new Date();
  _.extend(temperature, req.body);
  temperature.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      TemperatureModel.findOne({_id: temperature._id})
        .exec(function(err, resTmp) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resTmp) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resTmp);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {get} /api/temperatures/last
 * @apiGroup Temperatures
 * @apiDescription get the last measure
 *
 */
exports.getLast = function getLast(req, res) {
  TemperatureModel.findOne()
  .sort({date: -1}).exec(function(err, temperature) {
    if (err){
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!temperature) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      res.json(temperature);
    }
  });
}

/**
 *
 * @api {get} /api/temperatures/:id
 * @apiGroup Temperatures
 * @apiDescription request temperature by id
 * @apiParam {String} id id of the temperature
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  TemperatureModel.findOne({_id: id})
    .exec(function(err, temperature) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!temperature) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(temperature);
      }
    })
  ;
};

/**
 *
 * @api {delete} /api/temperatures/:id
 * @apiGroup Temperatures
 * @apiDescription delete a temperature
 * @apiParam {String} id id of the temperature
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  TemperatureModel.findOne({ _id: id }, function (err, tmp) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!tmp) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      TemperatureModel.findOneAndRemove({ _id: id })
        .exec(function (err, resTmp) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resTmp) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resTmp);
          }
        })
      ;
    }
  });
};
