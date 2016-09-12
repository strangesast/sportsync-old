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

const serviceUuids = [convert('13333333333333333333333333333337')];

var filters = [
  {
    services: serviceUuids
  }
];

var val;

var begin, end;

var getBluetoothDevice = function() {
  if(navigator.bluetooth == null) throw new Error('bluetooth unsupported');
  return navigator.bluetooth.requestDevice({
    filters: filters
  }).then(function(device) {
    return device.gatt.connect();
  });
};
  
var getBluetoothServiceCharacteristic = function(service, characteristicUuid) {
  return server.getPrimaryService(service).then(function(service) {
    return service.getCharacteristic(characteristic);
  });
};
  
var sendToCharacteristic = function(characteristic) {
  var begin = Date.now();
  return characteristic.readValue().then(function(value) {
    val = value;
    end = Date.now();
    var textDecoder = new TextDecoder('utf-8');
    var text = textDecoder.decode(value);
    var obj = JSON.parse(text);
    console.log('readvalue delta:', end - begin);
    console.log('decode delta:   ', Date.now() - end);
    document.getElementById('out').textContent = text;
    console.log(text);
  
  }).catch(function(err) {
    alert('error');
    throw err;
  });
};
