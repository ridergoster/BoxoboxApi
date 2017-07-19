// Init variable
var mongoose = require('mongoose');
var HumidityModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/humidities
 * @apiGroup Humidities
 * @apiDescription request all humidities record
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

  HumidityModel.find(research)
  .sort(sort)
  .exec(function(err, humidities) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(humidities);
      }
    })
  ;
};

/**
 *
 * @api {post} /api/humidities
 * @apiGroup Humidities
 * @apiDescription create a humidity
 * @apiParam {Number} value humidity measure
 * @apiParam {Date} date date of the measure
 *
 */
exports.post = function post(req,res) {
  var humidity = new HumidityModel();
  humidity.date = new Date();
  _.extend(humidity, req.body);
  humidity.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      HumidityModel.findOne({_id: humidity._id})
        .exec(function(err, resHm) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resHm) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resHm);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {get} /api/humidities/last
 * @apiGroup Humidities
 * @apiDescription get the last measure
 *
 */
exports.getLast = function getLast(req, res) {
  HumidityModel.findOne()
  .sort({date: -1}).exec(function(err, humidity) {
    if (err){
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!humidity) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      res.json(humidity);
    }
  });
}

/**
 *
 * @api {get} /api/humidities/:id
 * @apiGroup Humidities
 * @apiDescription request humidity by id
 * @apiParam {String} id id of the humidity
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  HumidityModel.findOne({_id: id})
    .exec(function(err, humidity) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!humidity) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(humidity);
      }
    })
  ;
};

/**
 *
 * @api {delete} /api/humidities/:id
 * @apiGroup Humidities
 * @apiDescription delete a humidity
 * @apiParam {String} id id of the humidity
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  HumidityModel.findOne({ _id: id }, function (err, hm) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!hm) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      HumidityModel.findOneAndRemove({ _id: id })
        .exec(function (err, resHm) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resHm) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resHm);
          }
        })
      ;
    }
  });
};
