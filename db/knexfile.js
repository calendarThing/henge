var config = require('../config.js');
module.exports = {
    client: 'postgresql',
    connection: {
      host     : process.env.APP_DB_HOST     || config.db_host,
      user     : process.env.APP_DB_USER     || config.db_user,
      password : process.env.APP_DB_PASSWORD || config.db_pass,
      database : process.env.APP_DB_NAME     || 'henge'
    },
    pool: {
      min: 2,
      max: 10
    }
  };
