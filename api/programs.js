const { Pool } = require('@vercel/postgres');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { rows } = await pool.sql`SELECT id, name, blocks, news FROM programs`;
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      error: 'Failed to load programs',
      details: err.message
    });
  }
};
