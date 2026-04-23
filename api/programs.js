// api/programs.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Get programs (filter by user if not super admin)
    if (req.method === 'GET') {
      const { user, admin } = req.query;
      let result;
      if (admin === 'true') {
        result = await pool.query('SELECT * FROM programs');
      } else {
        result = await pool.query('SELECT * FROM programs WHERE created_by = $1', [user]);
      }
      return res.json(result.rows);
    }

    // Create program
    if (req.method === 'POST') {
      const { name, createdBy, blocks, news } = req.body;
      const result = await pool.query(
        'INSERT INTO programs (name, created_by, blocks, news) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, createdBy, blocks, news]
      );
      return res.status(201).json(result.rows[0]);
    }

    // Delete program
    if (req.method === 'DELETE') {
      const id = req.query.id;
      await pool.query('DELETE FROM programs WHERE id = $1', [id]);
      return res.json({ success: true });
    }

    // Update blocks/layout
    if (req.method === 'PATCH') {
      const { blocks } = req.body;
      const id = req.query.id;
      await pool.query('UPDATE programs SET blocks = $1 WHERE id = $2', [blocks, id]);
      return res.json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
