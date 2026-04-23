// api/login.js (Vercel Serverless Function)
const { Pool } = require('pg');

// Initialize Neon DB Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Critical for Neon DB
});

// Login API Endpoint
module.exports = async (req, res) => {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    // Query Neon DB for user
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    // Return user data (hide password in production)
    const user = result.rows[0];
    res.status(200).json({
      username: user.username,
      role: user.role,
      id: user.id
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
