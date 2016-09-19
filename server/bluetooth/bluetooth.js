var bleno = require('bleno');
var Service = require('./service');
var settings = require('../config').settings;

var service = new Service();
const name = settings.serviceName;

// uuids
var services = [service];
var serviceUuids = [service.uuid];
var characteristicUuids = service.characteristics.map((c)=>c.uuid);

var listen = function() {
  return new Promise(function(resolve, reject) {
    bleno.on('stateChange', function(state) {
      if (state === 'poweredOn') {
        bleno.startAdvertising(name, serviceUuids, function(err) {
          if (err) {
            return reject(err);
          }
        });
      } else {
        bleno.stopAdvertising();
      }
    });
    
    bleno.on('advertisingStart', function(err) {
      if (!err) {
        console.log('advertising bluetooth service...');
        bleno.setServices(services);
        return resolve();

      } else {
        return reject(err);
      }
    });
  });
};

module.exports = {
  listen: listen,
  serviceUuids: serviceUuids,
  characteristicUuids: characteristicUuids,
  services: services
};
