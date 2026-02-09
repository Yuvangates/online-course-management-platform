const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool(
    process.env.DATABASE_URL
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: { rejectUnauthorized: false } // Required for Render external connections
          }
        : {
              user: process.env.DB_USER,
              host: process.env.DB_HOST,
              port: process.env.DB_PORT || 5432,
              database: process.env.DB_NAME,
              password: process.env.DB_PASSWORD,
          }
);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;
