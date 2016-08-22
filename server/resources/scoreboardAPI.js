// Load requirements
var http = require('http'),
    io = require('socket.io');

function init (port) {
  // Create server & socket
  var server = http.createServer(function(req, res){
    // Send HTML headers and message
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Aw, snap! 404</h1>');
  });
  
  server.listen(port);
  io = io.listen(server);
  
  // Add a connect listener
  io.sockets.on('connection', function(socket) { 
    console.log('Client connected.');
  
    socket.join('client1');
    socket.on('CH01', function (from, msg) {

    console.log('MSG', from, ' saying ', msg);
  
    // send it back
    //io.sockets.in('client1').emit('CH01', {boardname: 'board4', field2: 'test msg'});
    });
  
    // Disconnect listener
    socket.on('disconnect', function() {
      console.log('Client disconnected.');
    });

  });
  
  console.log ('end of init');
}

function loadboard (boardname) {
  console.log ("requesting to load board ", boardname);

  io.sockets.in('client1').emit('CH01', {
    boardname: 'board4',
    field2: 'test msg'
  });
}

module.exports = {
  init: init,
  loadboard: loadboard
};
