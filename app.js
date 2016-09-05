
var vbodyParser = require('body-parser'),
var config = require('config'),
var crypto = require('crypto'),
var express = require('express'),
var https = require('https'),
var request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

app.get('/hello', function(req, res){
  res.send('world!');
});
