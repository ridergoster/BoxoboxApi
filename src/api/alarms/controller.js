// Init variable
var mongoose = require('mongoose');
var AlarmModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/alarms
 * @apiGroup Alarms
 * @apiDescription request all answers
 * @apiParam {query} [after] date you want record to be after
 * @apiParam {query} [before] date you want record to be before
 * @apiParam {query} [orderDate] order results by date [ASC, DESC]
 * @apiParam {query} [sensor] sensor you want alarm from
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
  if (_.has(req.query, 'sensor')) {
    _.defaultsDeep(research, { 'sensor': req.query.sensor });
  }

  AlarmModel.find(research)
  .sort(sort)
  .populate('user')
  .exec(function(err, alarms) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(alarms);
      }
    })
  ;
};

/**
 *
 * @api {post} /api/alarms
 * @apiGroup Alarms
 * @apiDescription create an alarm
 * @apiParam {String} startDate date the alarm start
 * @apiParam {String} endDate date the alarm end
 * @apiParam {String} user user who end the alarm
 * @apiParam {String} sensor sensor who trigger the alarm [TEMPERATURE, LUMINOSITY, NOISE]
 *
 */
exports.post = function post(req,res) {
  var alarm = new AlarmModel();
  alarm.startDate = new Date(req.body.startDate)
  alarm.endDate = new Date(req.body.endDate)
  alarm.user = mongoose.Types.ObjectId(req.body.user);
  alarm.sensor = req.body.sensor;

  alarm.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      AlarmModel.findOne({_id: alarm._id})
        .populate('user')
        .exec(function(err, resAlarm) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resAlarm) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resAlarm);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {get} /api/alarms/:id
 * @apiGroup Alarms
 * @apiDescription request an alarm by id
 * @apiParam {String} id id of the alarm
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  AlarmModel.findOne({_id: id})
    .populate('user')
    .exec(function(err, alarm) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!alarm) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(alarm);
      }
    })
  ;
};

/**
 *
 * @api {delete} /api/answers/:id
 * @apiGroup Answers
 * @apiDescription delete an answer
 * @apiParam {String} id id of the answer
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  AlarmModel.findOne({ _id: id }, function (err, alarm) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!alarm) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      AlarmModel.findOneAndRemove({ _id: id })
        .populate('user')
        .exec(function (err, resAlarm) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resAlarm) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resAlarm);
          }
        })
      ;
    }
  });
};
