// Init variable
var mongoose = require('mongoose');
var ReportModel = require('./model');
var _ = require('lodash');

/**
 *
 * @api {get} /api/reports
 * @apiGroup Reports
 * @apiDescription request all reports
 * @apiParam {query} [isUser] type of the report [true, fale]
 * @apiParam {query} [isRecipe] type of the report [true, fale]
 *
 */
exports.get = function(req, res) {
  if (!req.user.admin) {
    res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  var research = null;
  if(req.query) {
    research = req.query;
    delete research.api_key;
  }
  ReportModel.find(research)
    .populate({
      path: 'recipe',
      populate: { path: 'owner' }})
    .populate('user')
    .populate('owner')
    .exec(function(err, reports) {
      if (err) {
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else {
        res.json(reports);
      }
    })
  ;
};

 /**
  *
  * @api {get} /api/reports/:id
  * @apiGroup Reports
  * @apiDescription request reports by id
  * @apiParam {String} id id of the report
  *
  */
exports.getById = function getById(req, res) {
  if (!req.user.admin) {
    res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  var id = mongoose.Types.ObjectId(req.params.id);
  ReportModel.findOne({_id: id})
    .populate({
      path: 'recipe',
      populate: { path: 'owner' }})
    .populate('user')
    .populate('owner')
    .exec(function(err, report) {
      if (err){
        res.status(400).send({ error: 'BAD_REQUEST', code: 400});
      }
      else if (!report) {
        res.status(404).send({ error: 'NOT_FOUND', code: 404});
      }
      else {
        res.json(report);
      }
    })
  ;
};
/**
 *
 * @api {post} /api/reports
 * @apiGroup Reports
 * @apiDescription create a reports
 * @apiParam {String} user id of the report
 * @apiParam {String} recipe id of the recipe to report
 * @apiParam {String} message message in the report
 *
 */
exports.post = function post(req,res) {
  var report = new ReportModel();
  report.owner = req.user._id;
  _.extend(report,req.body);
  if(!_.isEmpty(_.get(report, 'user'))) {
    delete report.user;
    report.isUser = true;
    report.user = mongoose.Types.ObjectId(req.body.user);
  }
  if(!_.isEmpty(_.get(report, 'recipe'))) {
    delete report.recipe;
    report.isRecipe = true;
    report.recipe = mongoose.Types.ObjectId(req.body.recipe);
  }

  report.save(function(err) {
    if (err) {
      res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
    }
    else {
      ReportModel.findOne({_id: report._id})
        .populate({
          path: 'recipe',
          populate: { path: 'owner' }})
        .populate('user')
        .populate('owner')
        .exec(function(err, resReport) {
          if (err) {
            res.status(400).send({ error: 'BAD_REQUEST', code: 400, log: err});
          }
          else if (!resReport) {
            res.status(404).send({ error: 'NOT_FOUND', code: 404});
          }
          else {
            res.json(resReport);
          }
        })
      ;
    }
  });
};

/**
 *
 * @api {delete} /api/reports/:id
 * @apiGroup Reports
 * @apiDescription delete a report
 * @apiParam {String} id id of the report
 *
 */
exports.del = function del(req, res) {
  if (!req.user.admin) {
    res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  else {
    var id = mongoose.Types.ObjectId(req.params.id);
    ReportModel.findOneAndRemove({ _id: id})
      .populate({
        path: 'recipe',
        populate: { path: 'owner' }})
      .populate('user')
      .populate('owner')
      .exec(function (err, resReport) {
        if (err) {
          res.status(400).send({ error: 'BAD_REQUEST', code: 400});
        }
        else if (!resReport) {
          res.status(404).send({ error: 'NOT_FOUND', code: 404});
        }
        else {
          res.json(resReport);
        }
      })
    ;
  }
};


/**
 *
 * @api {delete} /api/reports/user/:id
 * @apiGroup Reports
 * @apiDescription delete reports of user
 * @apiParam {String} id id of the user reports
 *
 */
exports.delUser = function delUser(req, res) {
  if (!req.user.admin) {
    res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  else {
    var id = mongoose.Types.ObjectId(req.params.id);
    ReportModel.find({ user: id })
      .populate({
        path: 'recipe',
        populate: { path: 'owner' }})
      .populate('user')
      .populate('owner')
      .exec(function (err, resReports) {
        if (err) {
          res.status(400).send({ error: 'BAD_REQUEST', code: 400});
        }
        else {
          ReportModel.remove({ user: id }, function(err, remove) {
            if (err) {
              res.status(400).send({ error: 'BAD_REQUEST', code: 400});
            }
            else {
              res.json(resReports);
            }
          });
        }
      })
    ;
  }
};

/**
 *
 * @api {delete} /api/reports/recipe/:id
 * @apiGroup Reports
 * @apiDescription delete reports of recipe
 * @apiParam {String} id id of the recipe reports
 *
 */
exports.delRecipe = function delRecipe(req, res) {
  if (!req.user.admin) {
    res.status(403).json({ error: 'FORBIDDEN', code: 403});
  }
  else {
    var id = mongoose.Types.ObjectId(req.params.id);
    ReportModel.find({ recipe: id })
      .populate({
        path: 'recipe',
        populate: { path: 'owner' }})
      .populate('user')
      .populate('owner')
      .exec(function (err, resReports) {
        if (err) {
          res.status(400).send({ error: 'BAD_REQUEST', code: 400});
        }
        else {
          ReportModel.remove({ recipe: id }, function(err, remove) {
            if (err) {
              res.status(400).send({ error: 'BAD_REQUEST', code: 400});
            }
            else {
              res.json(resReports);
            }
          });
        }
      })
    ;
  }
};
