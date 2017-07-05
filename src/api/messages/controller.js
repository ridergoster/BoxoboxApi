// Init variable
var MessageModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/messages request all messages
 * @apiGroup Messages
 * @apiDescription request all messages
 * @apiParam {query} [after] date you want record to be after
 * @apiParam {query} [before] date you want record to be before
 * @apiParam {query} [orderDate] order results by date [ASC, DESC]
 * @apiParam {query} [user] user you want message from
 *
 */
 exports.get = function get(req, res) {
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

  MessageModel.find(research)
  .sort(sort)
  .populate('user')
  .exec(function(err, messages) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else {
      res.json(messages);
    }
  });
 };

/**
 *
 * @api {post} /api/messages
 * @apiGroup Messages
 * @apiDescription create a message
 * @apiParam {String} message content of the message.
 *
 */
exports.post = function post(req,res) {
  var message = new MessageModel();
  message.date = new Date();
  message.user = req.user._id;
  message.message = req.body.message;

  message.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      MessageModel.findOne({_id: message._id})
        .populate('user')
        .exec(function(err, resMessage) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resMessage) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resMessage);
          }
        })
      ;
    }
  });
};


/**
 *
 * @api {delete} /api/messages/:id
 * @apiGroup Messages
 * @apiDescription delete a message
 * @apiParam {String} id id of the message
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  MessageModel.findOne({ _id: id }, function (err, message) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!message) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else {
      MessageModel.findOneAndRemove({ _id: id })
        .populate('user')
        .exec(function (err, resMessage) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resMessage) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resMessage);
          }
        })
      ;
    }
  });
};
