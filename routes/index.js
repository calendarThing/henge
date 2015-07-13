var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';

var config = require('./../config.js');
var app = require('./../app.js');
var database = app.get('database');
var passport = require('passport');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var nonce = uuid.v4();
var knex = require('knex');
// var mailer = require('../mailer/mailer.js');

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var redis = require('redis');
var redisClient = redis.createClient(config.redis_port, config.redis_endpoint, {no_ready_check: true});
 
redisClient.auth(config.redis_password, function (err) {
    if (err) throw err;
});

redisClient.on('connect', function() {
    console.log('Connected to Redis');
});

/* GET home page. */
router.get('/', function(request, response) {
  // database('person').insert({name: 'tom'});
  response.render('index', { title: 'Calendar Thing' });
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
  // Register them! Adds username and password to db, generates a 
  // nonce & associates that with the db user id, storing both in redis.
  // Finally, sends a verification email to the user with a link
  // to a url based on the generated nonce.
  var email = request.body.email;
  var password = request.body.password;

  var mailOptions = {
    auth: {
      api_user: config.sg_username,
      api_key: config.sg_password
    }
  };

  var mailClient = nodemailer.createTransport(sgTransport(mailOptions));

  // Sends the email and sets up values in Redis
  var mailer = function(user) {

    var emailTemplate = {
      from: 'DoNotReply@calendarThing.com',
      to: user.email,
      subject: 'CalendarThing registration',
      text: 'CalendarThing registration',
      html: '<p>Click <a href="http://localhost:3000/verify/' + user.nonce + '">here</a></p>'
    };

    redisClient.set( user.nonce, user.id, function() {
      mailClient.sendMail(emailTemplate, function(err, info){
        if (err){
          console.log(err);
        }
        else {
          console.log('Message sent: ' + info.response);
        }
      });
    });
  };

  //stores username and password hash/salt in db, then calls mailer
  database('person').where({
    email: email
  }).then(function(result) {
    if (result.length !== 0) {
      console.error('Email address in use!');
      response.redirect('/login'); // we'll want error codes for this
    } else {
      bcrypt.hash(password, 12, function(err, hash) {
        var id = database('person').insert({ 
          email: email, 
          hash: hash })
          .returning('id') // required for psql
          // generate nonce & send confirmation email
          .then(function(id) {
            mailer({ email: email, nonce: nonce, id: id });
            response.redirect('/newuser');
          });
      });
    }
  });
});

router.get('/verify/:nonce', function(request, response) {
  var nonce = request.params.nonce;
  redisClient.get(nonce, function(err, userId) {
    redisClient.del(nonce, function() {
      if (userId) {
        response.redirect('/');
      } else {
        console.error('Invalid verification code!');
      }
    });
  });
});

module.exports = router;
