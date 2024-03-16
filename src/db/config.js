/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
};
