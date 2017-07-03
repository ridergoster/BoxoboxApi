// Init variable
var mongoose = require('mongoose');
var NoiseModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/noises
 * @apiGroup Noises
 * @apiDescription request all noises record
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

  NoiseModel.find(research)
  .sort(sort)
  .exec(function(err, noises) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(noises);
      }
    })
  ;
};

/**
 *
 * @api {post} /api/noises
 * @apiGroup Noises
 * @apiDescription create a noise
 * @apiParam {Number} value noise measure
 * @apiParam {Date} date date of the measure
 *
 */
exports.post = function post(req,res) {
  var noise = new NoiseModel();
  noise.date = new Date();
  _.extend(noise, req.body);
  noise.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      NoiseModel.findOne({_id: noise._id})
        .exec(function(err, resNoise) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resNoise) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resNoise);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {get} /api/noises/last
 * @apiGroup Noises
 * @apiDescription get the last measure
 *
 */
exports.getLast = function getLast(req, res) {
  NoiseModel.findOne()
  .sort({date: -1}).exec(function(err, noise) {
    if (err){
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!noise) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      res.json(noise);
    }
  });
}

/**
 *
 * @api {get} /api/noises/:id
 * @apiGroup Noises
 * @apiDescription request noise by id
 * @apiParam {String} id id of the noise
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  NoiseModel.findOne({_id: id})
    .exec(function(err, noise) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!noise) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(noise);
      }
    })
  ;
};

/**
 *
 * @api {delete} /api/noises/:id
 * @apiGroup Noises
 * @apiDescription delete a noise
 * @apiParam {String} id id of the noise
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  NoiseModel.findOne({ _id: id }, function (err, noise) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!noise) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      NoiseModel.findOneAndRemove({ _id: id })
        .exec(function (err, resNoise) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resNoise) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resNoise);
          }
        })
      ;
    }
  });
};
