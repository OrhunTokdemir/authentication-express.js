const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.DATABASE_PASSWORD || 'your_password',
  port: 5432,
});

async function setupDatabase(pool) {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(username, email)
      )
    `);
    console.log('Database setup complete');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
  }
}
module.exports = {
  setupDatabase,
  pool,
};