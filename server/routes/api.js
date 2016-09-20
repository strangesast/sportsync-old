var express = require('express');
var router = express.Router();
var scoreboardapi = require('../resources/scoreboardAPI');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Action = require('../models/action');
var Event = require('../models/event');
var Game = require('../models/game');
var Player = require('../models/player');
var Team  = require('../models/team');
var Transaction = require('../models/transaction');
var ObjectId = mongoose.Types.ObjectId;

//var displayAction = require('../resources/display_action.js');

router.post('/loadboard', function(req, res) {
  console.log ('loadboard');
  var board_name = req.body.board_name;
  console.log ("post Loadboard: name=" + board_name);
  scoreboardapi.loadboard (board_name);
  var return_message = JSON.stringify('{status: ok}');
  console.log ("post Loadboard: name=" + board_name);
  return res.end(return_message);
});

var stringToModel = function(string) {
  switch(string) {
    case 'actions':
      return Action;
    case 'events':
      return Event;
    case 'games':
      return Game;
    case 'players':
      return Player;
    case 'teams':
      return Team;
    case 'transactions':
      return Transaction;
    default:
      throw new Error('unrecognized type string');
  }
};

router.get('/', function(req, res, next) {
  res.status(200);
  res.send();
})

router.route('/:type/:id?')
.get(function(req, res, next) {
  var type = req.params.type;
  var id = req.params.id;
  var Obj = stringToModel(type);
  if(id != null && !ObjectId.isValid(id)) {
    throw new Error('invalid objectid "'+id+'"');
  }
  if(id != null) {
    prom = Obj.findById(id);
  } else {
    prom = Obj.find();
  }
  return prom.exec().then(function(results) {
    return res.json(results);
  }).catch(function(err) {
    next(err);
  });
})
.post(function(req, res, next) {
  var type = req.params.type;
  var id = req.params.id;
  var Obj = stringToModel(type);
  var obj = new Obj(req.body);
  obj.save().then(function(results) {
    res.json(results);
  }).catch(function(err) {
    next(err);
  });
});

module.exports = router;
