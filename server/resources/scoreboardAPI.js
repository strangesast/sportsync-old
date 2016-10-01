// Load requirements
var http = require('http'),
    io = require('socket.io');
var uuid = require('node-uuid');

var callback_list = [];
function callbackRegister (msg, callback) {
  var id = uuid.v4();
  msg.conversation_guid = id;
  var item = {id: id, callback:callback};
  callback_list.push(item);
  return id;
}

function callbackPostresponse (msg) {
  if (msg.request.conversation_guid === undefined) {
    return;
  }
  //locate the ID
  for (i=0; i<callback_list.length; i++) {
    if (callback_list[i].id == msg.request.conversation_guid) {
      console.log ('calling subscriber callback - id ' + callback_list[i].id +  'msg: ' + msg);
      var response = JSON.stringify (msg.response_data);
      callback_list[i].callback.end (response);
      break;
    }
  }
}

   
var subscriber_callback = null;

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
    socket.on('CH01', function (msg) {

    console.log('MSG ', msg);
  
    // send it back
    //io.sockets.in('client1').emit('CH01', {boardname: 'board4', field2: 'test msg'});
    });
    socket.on('INFO', function (msg) {

    console.log('INFO ', msg);
    
    callbackPostresponse(msg);
  /*
    if (subscriber_callback) {
      console.log ('calling subscriber callback - msg: ', msg);
      var response = JSON.stringify (msg);
      subscriber_callback.end (response);
    }
    */
  
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
function scoreboardMsg (channel, msg) {
  console.log ("requesting to load board ", msg.request_type);
  io.sockets.in('client1').emit(channel, msg);
}

function scoreboardMsgSync (channel, msg, callback) {
  console.log ("request to board ", msg.request_type);
  callbackRegister (msg, callback);
  console.log ("test 3");

  io.sockets.in('client1').emit(channel, msg);
//   subscriber_callback = callback;
 
}

module.exports = {
  init: init,
  loadboard: loadboard,
  scoreboardMsg: scoreboardMsg,
  scoreboardMsgSync: scoreboardMsgSync
};
