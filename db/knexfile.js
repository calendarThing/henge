var config = require('../config.js');
var knex = require('knex')({
  client: 'postgres',
  connection: {
    host     : process.env.APP_DB_HOST     || '127.0.0.1',
    user     : process.env.APP_DB_USER     || config.db_user,
    password : process.env.APP_DB_PASSWORD || config.db_pass,
    database : process.env.APP_DB_NAME     || 'henge'
  }
});
