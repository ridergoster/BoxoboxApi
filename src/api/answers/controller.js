// Init variable
var mongoose = require('mongoose');
var AnswerModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/answers
 * @apiGroup Answers
 * @apiDescription request all answers
 * @apiParam {query} [after] date you want record to be after
 * @apiParam {query} [before] date you want record to be before
 * @apiParam {query} [orderDate] order results by date [ASC, DESC]
 * @apiParam {query} [user] user you want answer from
 * @apiParam {query} [question] question you want answer from
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
  if (_.has(req.query, 'user')) {
    _.defaultsDeep(research, { 'user': req.query.user });
  }
  if (_.has(req.query, 'question')) {
    _.defaultsDeep(research, { 'question': req.query.question });
  }

  AnswerModel.find(research)
  .sort(sort)
  .exec(function(err, answers) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(answers);
      }
    })
  ;
};

/**
 *
 * @api {post} /api/answers
 * @apiGroup Answers
 * @apiDescription create an answers
 * @apiParam {String} question questionId you answer
 * @apiParam {String} answer response in enum [LEFT, RIGHT]
 *
 */
exports.post = function post(req,res) {
  var answer = new AnswerModel();
  answer.user = req.user._id;
  answer.question = mongoose.Types.ObjectId(req.body.question);
  answer.answer = req.body.answer;
  answer.date = new Date();

  answer.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      AnswerModel.findOne({_id: answer._id})
        .exec(function(err, resAnswer) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resAnswer) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resAnswer);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {get} /api/answers/:id
 * @apiGroup Answers
 * @apiDescription request an answer by id
 * @apiParam {String} id id of the answer
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  AnswerModel.findOne({_id: id})
    .exec(function(err, answer) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!answer) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(answer);
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
  AnswerModel.findOne({ _id: id }, function (err, answer) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!answer) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      AnswerModel.findOneAndRemove({ _id: id })
        .exec(function (err, resAnswer) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resAnswer) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resAnswer);
          }
        })
      ;
    }
  });
};
