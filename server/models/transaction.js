var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

// Description: describes a change to an event or game (or anything else where
// version tables are not suitable)

var TransactionSchema = new Schema({
  old: Mixed,
  new: Mixed,
  date: Date,
  by: ObjectId
});

var Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
