var util = require('util');
var bleno = require('bleno');

function Characteristic() {
  bleno.Characteristic.call(this, {
    uuid: '13333333333333333333333333330001',
    properties: ['notify', 'indicate', 'read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Description...'
      })
    ]
  });
}

util.inherits(Characteristic, bleno.Characteristic);

Characteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  callback(this.RESULT_SUCCESS);
};

Characteristic.prototype.onReadRequest = function(offset, callback) {
  var data = new Buffer(1);
  data.writeUInt8(0, 0);
  callback(this.RESULT_SUCCESS, data);
};

module.exports = Characteristic;
