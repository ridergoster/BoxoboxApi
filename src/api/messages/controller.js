// Init variable
var MessageModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/messages request all messages
 * @apiGroup Messages
 * @apiDescription request all messages
 *
 */
 exports.get = function get(req, res) {
  var research = null;
  if (req.query) {
    research = req.query;
    delete research.api_key;
  }
  MessageModel.find(research, function(err, messages) {
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
 * @api {get} /api/messages/room/:id
 * @apiGroup Messages
 * @apiDescription request messages by chat id
 * @apiParam {String} id id of the chat
 *
 */
exports.getByRoom = function getByRoom(req, res) {
  var id = req.params.id;
  MessageModel.find({ roomId: id}, function(err, messages) {
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
 * @apiParam {String} username username of the User.
 * @apiParam {String} roomId id of the room.
 * @apiParam {String} message content of the message.
 *
 */
exports.post = function post(req,res) {
  var message = new MessageModel();
  _.extend(message,req.body);
  message.date = new Date();
  message.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else {
      res.json(message);
    }
  });
};
