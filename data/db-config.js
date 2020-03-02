require('dotenv').config();
const knex = require('knex');

const knexConfig = require('../knexfile');

const env = process.env.DB_ENV || 'staging';

module.exports = knex(knexConfig.staging);