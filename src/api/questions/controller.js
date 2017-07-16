// Init variable
var mongoose = require('mongoose');
var QuestionModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/questions
 * @apiGroup Questions
 * @apiDescription request all questions
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

  QuestionModel.find(research)
  .sort(sort)
  .populate('user')
  .exec(function(err, questions) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(questions);
      }
    })
  ;
};

/**
 *
 * @api {get} /api/questions/random
 * @apiGroup Questions
 * @apiDescription request random question
 *
 */
exports.getRandom = function(req, res) {
  QuestionModel.findOneRandom({}, {}, {populate: 'user'}, function(err, question) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else {
      res.json(question);
    }
  });
};

/**
 *
 * @api {post} /api/questions
 * @apiGroup Questions
 * @apiDescription create a question
 * @apiParam {String} question question to ask
 * @apiParam {String} answer_left answer from left
 * @apiParam {String} answer_right answer from right
 *
 */
exports.post = function post(req,res) {
  var question = new QuestionModel();
  question.user = req.user._id;
  question.date = new Date();
  _.extend(question, req.body);
  question.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      QuestionModel.findOne({_id: question._id})
        .populate('user')
        .exec(function(err, resQuestion) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resQuestion) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resQuestion);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {get} /api/questions/last
 * @apiGroup Questions
 * @apiDescription get the last question
 *
 */
exports.getLast = function getLast(req, res) {
  QuestionModel.findOne()
  .populate('user')
  .sort({date: -1}).exec(function(err, question) {
    if (err){
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!question) {
      res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      res.json(question);
    }
  });
}

/**
 *
 * @api {get} /api/questions/:id
 * @apiGroup Questions
 * @apiDescription request question by id
 * @apiParam {String} id id of the question
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  QuestionModel.findOne({_id: id})
    .populate('user')
    .exec(function(err, question) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!question) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(question);
      }
    })
  ;
};

/**
 *
 * @api {delete} /api/questions/:id
 * @apiGroup Questions
 * @apiDescription delete a question
 * @apiParam {String} id id of the question
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  QuestionModel.findOne({ _id: id }, function (err, question) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!question) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      QuestionModel.findOneAndRemove({ _id: id })
        .populate('user')
        .exec(function (err, resQuestion) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resQuestion) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resQuestion);
          }
        })
      ;
    }
  });
};
