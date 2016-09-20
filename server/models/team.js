var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Types.Mixed;


// Description: Collection of players

var TeamSchema = new Schema({
  name: String,
  players: [ObjectId]
});

var Team = mongoose.model('Team', TeamSchema, 'components');

module.exports = Team;
