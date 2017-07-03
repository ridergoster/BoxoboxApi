// Init variable
var mongoose = require('mongoose');
var GradeModel = require('./model');
var MatchModel = require('../match/model');
var RecipeModel = require('../recipes/model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/grades
 * @apiGroup Grades
 * @apiDescription request all grades
 * @apiParam {query} [note] note of the grade [0, 1, 2, 3]
 * @apiParam {query} [like] bool if recipe is like [true, false]
 *
 */
exports.get = function(req, res) {
  var research = null;
  if(req.query) {
    research = req.query;
    delete research.api_key;
  }
  GradeModel.find(research)
    .populate({
      path: 'recipe',
      populate: { path: 'owner' }})
    .populate('owner')
    .exec(function(err, grades) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(grades);
      }
    })
  ;
};

/**
 *
 * @api {get} /api/grades/:id
 * @apiGroup Grades
 * @apiDescription request grade by grade id
 * @apiParam {String} id id of the grade
 *
 */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  GradeModel.findOne({_id: id})
    .populate({
      path: 'recipe',
      populate: { path: 'owner' }})
    .populate('owner')
    .exec(function(err, grade) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!grade) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(grade);
      }
    })
  ;
};

/**
 *
 * @api {get} /api/grades/owner/:id
 * @apiGroup Grades
 * @apiDescription request grade by owner id
 * @apiParam {String} id id of the grade
 * @apiParam {query} [note] note of the grade [0, 1, 2, 3]
 * @apiParam {query} [like] bool if recipe is like [true, false]
 *
 */
exports.getByOwner = function getByOwner(req, res) {
  var research = {};
  if(req.query) {
    research = req.query;
    delete research.api_key;
  }
  var id;
  if(req.params.id === "me") {
    id = req.user._id;
  }
  else {
    id = mongoose.Types.ObjectId(req.params.id);
  }
  _.extend(research, {owner: id});
  GradeModel.find(research)
    .populate({
      path: 'recipe',
      populate: { path: 'owner' }})
    .populate('owner')
    .exec(function(err, grades) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(grades);
      }
    })
  ;
};

/**
 *
 * @api {get} /api/grades/recipe/:id
 * @apiGroup Grades
 * @apiDescription request grade by recipe id
 * @apiParam {String} id id of the recipe
 * @apiParam {query} [note] note of the grade [0, 1, 2, 3]
 * @apiParam {query} [like] bool if recipe is like [true, false]
 *
 */
exports.getByRecipe = function getByRecipe(req, res) {
  var research = {};
  if(req.query) {
    research = req.query;
    delete research.api_key;
  }
  mongoose.Types.ObjectId(req.params.id);
  _.extend(research, {recipe: id});
  GradeModel.find(research)
    .populate({
      path: 'recipe',
      populate: { path: 'owner' }})
    .populate('owner')
    .exec(function(err, grades) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(grades);
      }
    })
  ;
};

/**
 *
 * @api {post} /api/grades
 * @apiGroup Grades
 * @apiDescription create a grade
 * @apiParam {Number} note note of the grade [0, 1, 2, 3]
 * @apiParam {Boolean} like bool if recipe is like [true, false]
 * @apiParam {String} recipe  id of the recipe
 *
 */
exports.post = function post(req,res) {
  var grade = new GradeModel();
  grade.owner = req.user._id;
  grade.DateCreated = new Date();
  _.extend(grade, req.body);
  if(!_.isEmpty(_.get(grade, 'recipe'))) delete grade.recipe;
  RecipeModel.findOne({_id: req.body.recipe}, function(err, recipe) {
    if (err) {
      return res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!recipe || !_.has(req.body, 'like')) {
      return res.status(422).send({ error: 'MISSING_PARAMETERS', code: 422});
    }
    else if (req.user._id.equals(recipe.owner)) {
      return res.status(403).send({error: 'FORBIDDEN', code: 403});
    }
    else {
      grade.recipe = recipe._id;
      grade.save(function(err) {
        if (err) {
          res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
        }
        else {
          GradeModel.findOne({_id: grade._id})
            .populate('owner')
            .populate({
              path: 'recipe',
              populate: { path: 'owner' }})
            .exec(function(err, resGrade) {
              if (err) {
                res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
              }
              else if (!resGrade) {
                res.status(404).send({ error: 'NOT_FOUND', code: 404});
              }
              else {
                res.json(resGrade);
              }
            })
          ;
        }
      });
    }
  });
};

/**
 *
 * @api {put} /api/grades/:id
 * @apiGroup Grades
 * @apiDescription update a grade
 * @apiParam {String} id id of the recipe
 * @apiParam {Number} note note of the grade [0, 1, 2, 3]
 * @apiParam {Boolean} like bool if recipe is like [true, false]
 * @apiParam {String} recipe  id of the recipe
 *
 */
exports.update = function update(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);

  GradeModel.findOne({ _id: id }, function (err, grade) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!grade) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else if (!req.user._id.equals(grade.owner) && !req.user.admin) {
      res.status(403).json({ error: 'FORBIDDEN', code: 403});
    }
    else {
      var update = req.body;
      if(_.has(update, '_id')) delete update._id;
      if(_.has(update, 'owner')) delete update.owner;
      if(_.has(update, 'recipe')) delete update.recipe;
      grade = _.extend(grade, update);
      grade.save(function (err) {
        if(err) {
          res.status(400).send({ error: 'BAD_REQUEST', code: 400});
        }
        else {
          GradeModel.findOne({_id: grade._id})
            .populate('owner')
            .populate({
              path: 'recipe',
              populate: { path: 'owner' }})
            .exec(function(err, resGrade) {
              if (err) {
                res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
              }
              else if (!resGrade) {
                res.status(404).send({ error: 'NOT_FOUND', code: 404});
              }
              else {
                res.json(resGrade);
              }
            })
          ;
        }
      });
    }
  });
};

/**
 *
 * @api {delete} /api/grades/:id
 * @apiGroup Grades
 * @apiDescription delete a grade
 * @apiParam {String} id id of the recipe
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  GradeModel.findOne({ _id: id }, function (err, grade) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!grade) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else if (!req.user._id.equals(grade.owner) && !req.user.admin) {
      res.status(403).json({ error: 'FORBIDDEN', code: 403});
    }
    else {
      GradeModel.findOneAndRemove({ _id: id })
        .populate('owner')
        .populate({
          path: 'recipe',
          populate: { path: 'owner' }})
        .exec(function (err, resGrade) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resGrade) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resGrade);
          }
        })
      ;
    }
  });
};
