var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';

var app = require('./../app.js');
var database = app.get('database');
var passport = require('passport');

/* GET home page. */
router.get('/', function(request, response) {
  // database('person').insert({name: 'tom'});
  response.render('index', { title: 'Calendar Thing' });
});

router.get('/insert', function(request, response) {
  database('person').insert({name: 'tom'}).then(function() {
    console.log('inserting');
    response.cookie('user', 'tom');
    response.redirect('/');
  });
});

router.get('/newuser', function(request, response) {
  response.render('newuser');
});

router.get('/login', function(request, response) {
  response.render('login', {title: 'Calendar Thing'});
});

router.post('/api/login', function(request, response) {
  // Log them in!
  response.redirect('/');
});

router.post('/api/register', function(request, response) {
  // Register them!
  response.redirect('/newuser');
});

module.exports = router;
