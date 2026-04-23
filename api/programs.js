// api/programs.js
const { Pool } = require('pg');

// Use the environment variable for your Neon connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Query the programs table
    const { rows } = await pool.query('SELECT id, name, blocks, news FROM programs');
    console.log('Fetched programs:', rows); // Log the result for debugging
    res.status(200).json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to load programs' });
  }
};
