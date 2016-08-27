var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var Mixed = mongoose.Types.Mixed;


// Description: Collection of players

var TeamSchema = new Schema({
  name: String,
  players: [ObjectId]
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = Team;
