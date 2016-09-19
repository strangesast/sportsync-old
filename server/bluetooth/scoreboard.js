var events = require('events');
var util = require('util');

function Scoreboard() {
  events.EventEmitter.call(this);
  this.properties = {};
}

util.inherits(Scoreboard, events.EventEmitter);

Scoreboard.prototype.update = function(newval) {
  var ob = null;
  try {
    ob = JSON.parse(newval);
  } catch (e) {
    console.error('failed to parse... "'+newval+'"');
    return;
  }
  this.properties = ob;
  this.emit('update', ob);
};

module.exports = Scoreboard;
