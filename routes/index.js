var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';

var app = require('./../app.js');
var database = app.get('database');
var passport = require('passport');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var knex = require('knex');

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
  var email = request.body.email;
  var password = request.body.password;
  database('person').where({
    email: email
  }).then(function(result) {
    if (result.length !== 0) {
      console.log(result);
      console.error('Email address in use!');
      response.redirect('/login'); // we'll want error codes for this
    } else {
      bcrypt.hash(password, 12, function(err, hash) {
        console.log(password + ': ' + hash);
        database('person').insert({ 
          email: email, 
          hash: hash })
          .then(function() {
            response.redirect('/newuser');
          });
      });
    }
  });
});

module.exports = router;
