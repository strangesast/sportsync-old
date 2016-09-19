var WebSocketServer = require('ws').Server;
var cuid = require('cuid');
var config = require('./config');

var connectionListener = function(ws) {
  var message = {
    type: 'init',
    value: cuid()
  };
  ws.send(JSON.stringify(message));
};

module.exports = function(server, bluetoothServices) {
  // for now just one bluetooth service / characteristic
  bluetoothServices[0].characteristics[0].scoreboard.on('update', function(props) {
    console.log('update!');
    console.log(props);
    var message = {
      type: 'update',
      value: props
    };
    wss.clients.forEach(function(ws) {
      ws.send(JSON.stringify(message));
    });
  });
  var wss = new WebSocketServer({
    server: server,
    path: config.SOCKET_URL
  });

  wss.on('connection', connectionListener);
}
