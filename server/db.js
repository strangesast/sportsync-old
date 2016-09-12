var mongoose = require('mongoose');
var config = require('./config');

var url = config.DB_URL;

mongoose.connection.on('connected', function() {
  console.log('Mongo connection established on ' + url);
});

mongoose.connection.on('error', function(err) {
  console.log('Mongo error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongo connection lost.');
});

mongoose.connect(url);
