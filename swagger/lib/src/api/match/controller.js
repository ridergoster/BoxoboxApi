// Init variable
var mongoose = require('mongoose');
var MatchModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/match
 * @apiGroup Match
 * @apiDescription request all match
 * @apiParam {query} [match] bool if match or not [true, false]
 *
 */
exports.get = function get(req, res) {
  var research = null;
  if(req.query) {
    research = req.query;
    delete research.api_key;
  }
  MatchModel.find(research)
  .populate('user1')
  .populate('user2')
  .exec(function(err, matches) {
    if (err) {
      return res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else {
      res.json(matches);
    }
  });
};


/**
 *
 * @api {get} /api/match/:id
 * @apiGroup Match
 * @apiDescription request a match by his id
 * @apiParam {String} id id of the match
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  MatchModel.findOne({_id: id})
  .populate('user1')
  .populate('user2')
  .exec(function(err, match) {
    if (err) {
      return res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else if (!match) {
      return res.status(404).send({ error: 'NOT_FOUND', code: 404});
    }
    else {
      return res.json(match);
    }
  });
};

/**
 *
 * @api {get} /api/match/user/:id
 * @apiGroup Match
 * @apiDescription request match for a user
 * @apiParam {String} id id of the user
 * @apiParam {query} [match] bool if match or not [true, false]
 *
 */
exports.getByUserId = function getByUserId(req, res) {
  var research = {};
  if(req.query) {
    research = req.query;
    delete research.api_key;
  }
  var id;
  if (req.params.id === 'me') {
    id = req.user._id;
  }
  else {
    id = mongoose.Types.ObjectId(req.params.id);
  }
  MatchModel.find({ $or: [_.extend({}, research, {user1: id}), _.extend({}, research, {user2: id})] })
  .populate('user1')
  .populate('user2')
  .exec(function(err, matches) {
    if (err) {
      return res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    else {
      return res.json(matches);
    }
  });
};

/**
 *
 * @api {delete} /api/match/:id1/:id2
 * @apiGroup Match
 * @apiDescription delete a match
 * @apiParam {String} id1 id of the a user
 * @apiParam {String} id2 id of the a user
 *
 */
exports.del = function del(req, res) {
  var id1 = mongoose.Types.ObjectId(req.params.id1);
  var id2 = mongoose.Types.ObjectId(req.params.id2);

  if (!req.user._id.equals(id1) && !req.user._id.equals(id2) && !req.user.admin) {
    res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  else {
    MatchModel.findOneAndRemove({ $or: [{ user1: id1, user2: id2 }, { user1: id2, user2: id1 }] })
    .populate('user1')
    .populate('user2')
    .exec(function(err, match) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!match) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(match);
      }
    });
  }
};
/**
 *
 * @api {post} /api/match/:id
 * @apiGroup Match
 * @apiParam {String} id id of the user to match
 * @apiDescription request a match between connected user and userId
 *
 */
exports.post = function post(req, res) {
  var match = new MatchModel();
  match.user1 = req.user._id;
  match.user2 = mongoose.Types.ObjectId(req.params.id);
  match.DateCreated = new Date();
  match.match = false;
  MatchModel.findOne({ $or: [{ user1: match.user1, user2: match.user2 }, { user1: match.user2, user2: match.user1 }] })
    .populate('user1')
    .populate('user2')
    .exec(function(err, resMatch) {
      if (err) {
        return res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
      }
      else if(!resMatch) {
        match.save(function(err) {
          if(err){
            return res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          } else {
            MatchModel.findOne({ user1: match.user1, user2: match.user2 })
              .populate('user1')
              .populate('user2')
              .exec(function(err, saveMatch) {
                if (err) {
                  return res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
                }
                else {
                  return res.json({match: saveMatch, isMatch: false });
                }
              })
            ;
          }
        });
      }
      else if (resMatch.match === true) {
        return res.json({match: resMatch, isMatch: false });
      }
      else if (resMatch.user1.equals(match.user1)) {
        return res.json({ match: resMatch, isMatch: false });
      }
      else {
        resMatch = _.extend(resMatch, {match:true});
        resMatch.save(function(err) {
          if(err){
            return res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          } else {
            MatchModel.findOne({ user1: resMatch.user1, user2: resMatch.user2 })
              .populate('user1')
              .populate('user2')
              .exec(function(err, saveMatch) {
                if (err) {
                  return res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
                }
                else {
                  return res.json({match: saveMatch, isMatch: true });
                }
              })
            ;
          }
        });
      }
    })
  ;
};
