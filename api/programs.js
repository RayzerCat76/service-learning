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

    const result = await pool.query('SELECT * FROM programs');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: err.message });
  }
};
