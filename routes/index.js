var express = require('express');
var router = express.Router();
var db = require('../db');
var Task = db.Mongoose.model('tasks', db.TaskSchema, 'tasks');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all tasks. */
router.get('/task/:page/:pageSize/:sort', function (req, res, next) {
  let perPage = Math.max(req.params.pageSize, 10);
  let currentPage = Math.max(0, req.params.page - 1);
  let sortedBy = req.params.sort;
  let totalObjects = 0;
  Task.find({ done: false }).limit(perPage).skip(perPage * currentPage).sort({createdAt: sortedBy}).lean().exec(function(err,docs){
    if (err) {
      res.status(500).json({ error: err.message });
      res.end();
      return;
    };
    Task.countDocuments({done: false}, function(error,count){
      if(error)totalObjects = -1;
      totalObjects = count;
      res.json({page: currentPage+1, count: totalObjects, pageSize: perPage, data: docs});
      res.end();
    })
  });
});

/* POST ONE task. */
router.post('/task', function (req, res, next) {
  var newtask = new Task(req.body); 
  newtask.save(function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          res.end();
          return;
      }
      res.json(newtask);
      res.end();
  });
});

/* PUT ONE task. */
router.put('/task/:id', function (req, res, next) {
  Task.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true }, function (err, doc) {
      if (err) {
          res.status(500).json({ error: err.message });
          res.end();
          return;
      }
      res.json(req.body);
      res.end();
  });
});

/* PATCH ONE task. */
router.patch('/task/:id', function (req, res, next) {
  Task.findOneAndUpdate({ _id: req.params.id }, [{$set: {done: {$eq: [ "$done", false ] }}}], { upsert: true }, function (err, doc) {
      if (err) {
          res.status(500).json({ error: err.message });
          res.end();
          return;
      }
      res.json(doc);
      res.end();
  });
});

/* DELETE ONE task. */
router.delete('/task/:id', function (req, res, next) {
  Task.find({ _id: req.params.id }).remove(function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          res.end();
          return;
      }
      res.json({success: true});
      res.end();
  });
});

/* GET all done tasks. */
router.get('/done/:page/:pageSize/:sort', function (req, res, next) {
  let perPage = Math.max(req.params.pageSize, 10);
  let currentPage = Math.max(0, req.params.page - 1);
  let sortedBy = req.params.sort;
  let totalObjects = 0;
  Task.find({ done: true }).limit(perPage).skip(perPage * currentPage).sort({createdAt: sortedBy}).lean().exec(function(err,docs){
    if (err) {
      res.status(500).json({ error: err.message });
      res.end();
      return;
    };
    Task.countDocuments({done: true}, function(error,count){
      if(error)totalObjects = -1;
      totalObjects = count;
      res.json({page: currentPage+1, count: totalObjects, pageSize: perPage, data: docs});
      res.end();
    })
  });
});
module.exports = router;
