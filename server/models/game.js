var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var Mixed = mongoose.Types.Mixed;


// Description: game general information, jno specific state info

var GameSchema = new Schema({
  name: String,
  teams: [ObjectId],
  start: Date,
  end: Date
});

var Game = mongoose.model('Game', GameSchema);

module.exports = Game;
