import pg from 'pg';
const { Pool } = pg;

import './env.js';

// Create the pool connection string
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Database connection function
export const connectDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`✅ Neon PostgreSQL Connected Successfully at: ${res.rows[0].now}`);
  } catch (error) {
    console.error(`❌ Error connecting to PostgreSQL:`, error);
    process.exit(1);
  }
};