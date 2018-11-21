const knex = require('knex');
const config = require('../knexfile');

const ENV = process.env.NODE_ENV || 'development';

const db = knex(config[ENV]);

module.exports = db;
