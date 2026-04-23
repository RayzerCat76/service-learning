// api/teachers.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Get all teachers
    if (req.method === 'GET') {
      const result = await pool.query('SELECT id, username, role FROM users WHERE role = $1', ['teacher']);
      return res.json(result.rows);
    }

    // Create teacher
    if (req.method === 'POST') {
      const { username, password } = req.body;
      await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        [username, password, 'teacher']
      );
      return res.status(201).json({ success: true });
    }

    // Delete teacher
    if (req.method === 'DELETE') {
      const id = req.query.id;
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return res.json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
