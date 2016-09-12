var bleno = require('bleno');
var Service = require('./service');

var service = new Service();
const name = 'test service';

var indexes = [0, 8, 12, 16, 20, 32];
var convert = function(uuidStr) {
  if(uuidStr.length < 32) throw new Error('bad uuid str');
  var arr = [];
  indexes.concat(uuidStr.length).reduce(function(a, b) {
    let sub = uuidStr.substring(a, b)
    if(sub != '') arr.push(sub);
    return b;
  });
  return arr.join('-');
}

var services = [service.uuid].map(convert);
var characteristics = service.characteristics.map((c)=>c.uuid).map(convert);

bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    bleno.startAdvertising(name, services, function(err) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(err) {
  if (!err) {
    console.log('advertising...');
    bleno.setServices([
      service
    ]);
  }
});

module.exports = {
  listen: function() {
    console.log('listening...');
  },
  services: services,
  characteristics: characteristics
};
