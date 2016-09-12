/* express setup */
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');

var config = require('./config');
var websocket = require('./ws');
var bluetooth = require('./bluetooth');

app.set('views', path.join(__dirname));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname)));
/* end express setup */


bluetooth.listen();

app.get('/', function (req, res) {
  res.render('index', {
    services: bluetooth.services,
    characteristics: bluetooth.characteristics
  });
});

var server = http.createServer(app);

websocket(server);
server.listen(config.PORT);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  console.log('Example app listening on ' + addr.address + addr.port);
}
