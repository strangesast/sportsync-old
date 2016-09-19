var util = require('util');
var bleno = require('bleno');
var settings = require('../config').settings; // should probably be stored below

function Characteristic(scoreboard) {
  bleno.Characteristic.call(this, {
    uuid: settings.characteristicUuid,
    properties: ['notify', 'indicate', 'read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Description... scoreboard'
      })
    ]
  });
  this.scoreboard = scoreboard;
}

util.inherits(Characteristic, bleno.Characteristic);

Characteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this.scoreboard.update(data.toString());
  callback(this.RESULT_SUCCESS);
};

const text = JSON.stringify({
  id: 12345,
  prev_id: 23456,
  value: 'toast',
  property: 'most',
  user: 'sam'
});

Characteristic.prototype.onReadRequest = function(offset, callback) {
  var data = new Buffer(text, 'utf-8');
  var result = this.RESULT_SUCCESS;

  if(offset > data.length) {
    result = this.RESULT_INVALID_OFFSET;
    data = null;
  } else {
    data = data.slice(offset);
  }

  return callback(result, data);
};

module.exports = Characteristic;
