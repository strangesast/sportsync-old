var WebSocketServer = require('ws').Server;
var config = require('./config');

var connectionListener = function(ws) {
  console.log('new connection!');

};

module.exports = function(server) {
  var wss = new WebSocketServer({
    server: server,
    path: config.SOCKET_URL
  });

  wss.on('connection', connectionListener);
}
