const { Pool } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    const result = await client.query('SELECT id, name, blocks, news FROM programs');
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
};
