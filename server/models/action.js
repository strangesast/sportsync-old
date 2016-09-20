var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Types.Mixed;

// Description: transaction template, generates a transaction after user (or
// timing system) input

var ActionSchema = new Schema({
  'event': ObjectId
});

var Action = mongoose.model('Action', ActionSchema, 'components');

module.exports = Action;
