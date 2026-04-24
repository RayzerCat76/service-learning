const { Pool } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: Check environment variable
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL missing' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Use explicit schema to match your database
    const { rows } = await pool.query('SELECT id, name, blocks, news FROM public.programs');
    return res.status(200).json({
      count: rows.length,
      data: rows
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
