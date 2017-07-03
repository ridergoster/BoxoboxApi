// Init variable
var mongoose = require('mongoose');
var RecipeModel = require('./model');
var GradeModel = require('../grades/model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/recipes
 * @apiGroup Recipes
 * @apiDescription request all recipes
 * @apiParam {query} [type] type of the recipe [sweet, salt]
 * @apiParam {query} [dish] dish of the recipe [entrance, main, dessert]
 *
 */
 exports.get = function(req, res) {
   var research = null;
   if(req.query) {
     research = req.query;
     delete research.api_key;
   }
   RecipeModel.find(research)
   .populate('owner')
   .exec(function(err, recipes) {
     if (err) {
       res.status(400).send({ error: 'BAD_REQUEST', code: 400});
     }
     else {
       res.json(recipes);
     }
   });
 };

 /**
  *
  * @api {get} /api/recipes/random
  * @apiGroup Recipes
  * @apiDescription request random recipes
  * @apiParam {query} [type] type of the recipe [sweet, salt]
  * @apiParam {query} [dish] dish of the recipe [entrance, main, dessert]
  *
  */
exports.getRandom = function getRandom(req, res) {
  var research = null;
  if(req.query) {
    research = req.query;
    delete research.api_key;
  }
  GradeModel.find({owner: req.user._id}, function(err, grades) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400});
    }
    var arr = [];
    _.forEach(grades, function(grade) {
      arr.push(grade.recipe);
    });
    _.extend(research, {_id: { $nin: arr}, owner: {$ne: req.user._id }});
    RecipeModel.findRandom(research, {}, { limit: 20, populate: 'owner' }, function(err, recipes) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        return res.json(recipes);
      }
    });
  });
};
 /**
  *
  * @api {get} /api/recipes/:id
  * @apiGroup Recipes
  * @apiDescription request recipes by recipe id
  * @apiParam {String} id id of the recipe
  *
  */
exports.getById = function getById(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  RecipeModel.findOne({_id: id})
    .populate('owner')
    .exec(function(err, recipes) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!recipes) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(recipes);
      }
    })
  ;
};

/**
 *
 * @api {get} /api/recipes/owner/:id
 * @apiGroup Recipes
 * @apiDescription request recipes by user id
 * @apiParam {String} id id of the user
 *
 */
exports.getByOwner = function getByOwner(req, res) {
  var id;
  if(req.params.id === 'me') {
    id = req.user._id;
  } else {
    id = mongoose.Types.ObjectId(req.params.id);
  }
  RecipeModel.find({owner: id})
    .populate('owner')
    .exec(function(err, recipes) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(recipes);
      }
    })
  ;
};

/**
 *
 * @api {put} /api/recipes/:id
 * @apiGroup Recipes
 * @apiDescription update a recipe
 * @apiParam {String} id id of the recipe
 * @apiParam {String} name name of the recipe
 * @apiParam {String} url  URL of the recipe recipe
 * @apiParam {String} description description of the recipe
 * @apiParam {String} type type of the recipe [sweet, salt]
 * @apiParam {String} dish dish of the recipe [entrance, main, dessert]
 * @apiParam {String} steps steps of the recipe
 *
 */
exports.update = function update(req, res) {
  RecipeModel.findOne({ _id: req.params.id }, function (err, recipe) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!recipe) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else if (!req.user._id.equals(recipe.owner) && !req.user.admin) {
      res.status(403).json({ error: 'FORBIDDEN', code: 403});
    }
    else {
      var update = req.body;
      if(_.has(update, '_id')) delete update._id;
      if(_.has(update, 'owner')) delete update.owner;
      recipe = _.extend(recipe, update);
      recipe.save(function(err) {
        if (err) {
          res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
        }
        else {
          RecipeModel.findOne({_id: recipe._id})
            .populate('owner')
            .exec(function(err, resRecipe) {
              if (err) {
                res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
              }
              else if (!resRecipe) {
                res.status(404).send({ error: 'NOT_FOUND', code: 404});
              }
              else {
                res.json(resRecipe);
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
 * @api {post} /api/recipes
 * @apiGroup Recipes
 * @apiDescription create a recipe
 * @apiParam {String} name name of the recipe
 * @apiParam {String} url  URL of the recipe recipe
 * @apiParam {String} description description of the recipe
 * @apiParam {String} type type of the recipe [sweet, salt]
 * @apiParam {String} dish dish of the recipe [entrance, main, dessert]
 * @apiParam {String} steps steps of the recipe
 *
 */
exports.post = function post(req,res) {
  var recipe = new RecipeModel();
  recipe.owner = req.user._id;

  _.extend(recipe,req.body);

  if( _.isEmpty(_.get(recipe, 'name')) || _.isEmpty(_.get(recipe, 'url')) ) {
    return res.status(422).send({ error: 'MISSING_PARAMETERS', code: 422});
  }
  recipe.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      RecipeModel.findOne({_id: recipe._id})
        .populate('owner')
        .exec(function(err, resRecipe) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resRecipe) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resRecipe);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {delete} /api/recipes/:id
 * @apiGroup Recipes
 * @apiDescription delete a recipe
 * @apiParam {String} id id of the recipe
 *
 */
exports.del = function del(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  RecipeModel.findOne({ _id: id }, function (err, recipe) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else if (!recipe) {
      res.status(404).json({ error: 'NOT_FOUND', code: 404});
    }
    else if (!req.user._id.equals(recipe.owner) && !req.user.admin) {
      res.status(403).json({ error: 'FORBIDDEN', code: 403});
    }
    else {
      RecipeModel.findOneAndRemove({ _id: id })
        .populate('owner')
        .exec(function (err, resRecipe) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400});
          }
          else if (!resRecipe) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            // Remove liked
            GradeModel.remove({recipe: resRecipe._id}).exec();
            res.json(resRecipe);
          }
        })
      ;
    }
  });
};
