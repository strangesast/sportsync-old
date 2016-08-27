var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var Mixed = mongoose.Types.Mixed;


// Description: state information about some subdivision of game, time stored
// for stopwatch-like storage of current event time.  May have additional timers.

var EventSchema = new Schema({
  name: String,
  time: {
    start: Date,
    cumulative: Date
  }
});

var Event = mongoose.model('Event', EventSchema);

module.exports = Event;
