var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';

var app = require('./../app.js');
var database = app.get('database');

/* GET home page. */
router.get('/', function(req, res) {
  // database('person').insert({name: 'tom'});
  res.render('index', { title: 'Express' });
});

router.get('/insert', function(request, response) {
  database('person').insert({name: 'tom'}).then(function() {
    console.log('inserting');
    response.cookie('user', 'tom');
    response.redirect('/');
  });
});

module.exports = router;
