const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.USERDB,
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

console.log('Database Connected');

module.exports = pool;
