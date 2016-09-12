var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var Mixed = mongoose.Types.Mixed;


// Description: information about a player, not specific to particular game

var PlayerSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

var Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;
