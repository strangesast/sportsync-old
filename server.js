var express = require('express');
var path = require('path');

var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use(require('less-middleware')(__dirname));
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('index', {});
});

app.listen(3000, function() {
  console.log('listening...');
});
