var express = require('express');
var router = express.Router();
var settings = require('../config').settings;

var objects = require('../resources/testObjects');
var nextId = function(type) {
  // return next id, 1 higher than current largest
  var obj = objects[type];
  var keys = [];
  for(var prop in obj) {
    keys.push(Number(prop));
  }
  return String(Math.max.apply(null, keys)+1);
};

router.get(['/', '/app$'], function(req, res, next) {
  res.redirect('/app/');
});

// use '/app' prefix for all pages
var appRouter = express.Router();

const validTypes = ['games', 'players', 'teams']; // more to come
//appRouter.get('/:objectType/:objectId/*', function(req, res, next) {
//
//});

//appRouter.get('/games/:gameId'


appRouter.get(['/:pageName?/', '/:pageName/:pageInstance?/*'], function(req, res, next) {
  var pageName = req.params.pageName || 'index';
  var pageInstance = req.params.pageInstance;
  console.log(pageInstance != null);
  if(pageName.endsWith('s')) {
    pageName = pageName.slice(0, -1);
    if(pageInstance == null) { // whew
      pageName += '_list'; // if a specific object isn't requested, return list
    }
  }

  return res.render(pageName, {test: true, settings: settings});
});

router.use('/app', appRouter);


// use '/api' prefix for these routes

var apiRouter = express.Router();
apiRouter.get('/:objectName', function(req, res, next) {
  var obj = objects[req.params.objectName];
  var array = Object.keys(obj).map(function(i) {
    return obj[i];
  });
  return res.json(array);
});

apiRouter.post('/:objectName', function(req, res, next) {
  console.log(req.body);
  res.send();
});

router.use('/api', apiRouter);

router.get('/experimental/:pageName?', function(req, res, next) {
  res.render('experimental/' + (req.params.pageName || 'index'));// || 'index');
});

router.get('/static/:pageName?', function(req, res, next) {
  res.render('static/' + (req.params.pageName || 'index'));// || 'index');
});



module.exports = router;
