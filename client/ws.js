var config = require('./config');
var serverconfig = require('../server/config');
var WebSocket = require('ws');

var socketServerURL = 'ws://' + config.serverAddress + ':' + (config.serverPort || serverconfig.PORT) + serverconfig.SOCKET_URL;

var maxRetries = config.maxRetries;
var ws;
var setupWebsocket = function(retries) {
  if(retries < 0) return;
  console.log('attempt ' + retries + '...');
  ws = new WebSocket(socketServerURL);

  ws.on('open', function() {
    retries = maxRetries;
    console.log('connected!');
  });
  ws.on('message', function(data, flags) {
    console.log('message:');
  });
  ws.on('error', function(err) {
    console.log('error');
  });
  ws.on('close', function(stuff) {
    console.log('closed... reconnecting');
    setTimeout(setupWebsocket.bind(this, --retries), config.reconnectDelay || 500);
  });
};

module.exports = function(server) {
  setupWebsocket(maxRetries);
}
