const { Pool } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Check if the environment variable exists
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not set in Vercel environment variables' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // ✅ Fixed the typo
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 2. Test the connection and query
    const { rows } = await pool.query('SELECT id, name, blocks, news FROM programs');
    return res.status(200).json({
      message: 'Success',
      count: rows.length,
      data: rows
    });
  } catch (err) {
    // 3. Return the exact error message
    return res.status(500).json({
      error: 'Database query failed',
      details: err.message
    });
  }
};
