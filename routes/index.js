var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development';
var knexConfig = require('../db/knexfile.js')[env];
var knex = require('knex')(knexConfig);

knex('person').insert({name: 'tom'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
