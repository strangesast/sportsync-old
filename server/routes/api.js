var express = require('express');
var router = express.Router();
var scoreboardapi = require('../resources/scoreboardAPI');
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

router.get('/', function(req, res, next) {
  res.status(200);
  res.send();
})

module.exports = router;
