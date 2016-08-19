var express = require('express');
var path = require('path');
var app = express();

// config
var config = require('./config.js');
var port = config.PORT; // where is web access hosted

// web app configuration
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(port, function() {
  console.log('client application started on port "'+port+'"...');
});
