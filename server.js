const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// SERVE STATIC FILES (fixes Cannot GET /admin.html)
app.use(express.static('.'));

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ------------------------------
// API Routes
// ------------------------------

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid login' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username FROM users WHERE role = $1',
      ['teacher']
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create Teacher
app.post('/api/teachers', async (req, res) => {
  try {
    const { username, password } = req.body;
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, password, 'teacher']
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Teacher
app.delete('/api/teachers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Programs
app.get('/api/programs', async (req, res) => {
  try {
    const { user, admin } = req.query;
    let result;
    if (admin === 'true') {
      result = await pool.query('SELECT * FROM programs');
    } else {
      result = await pool.query('SELECT * FROM programs WHERE created_by = $1', [user]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create Program
app.post('/api/programs', async (req, res) => {
  try {
    const { name, createdBy, blocks, news } = req.body;
    const result = await pool.query(
      'INSERT INTO programs (name, created_by, blocks, news) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, createdBy, blocks, news]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Program
app.delete('/api/programs/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM programs WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Blocks
app.patch('/api/programs/:id/blocks', async (req, res) => {
  try {
    const { blocks } = req.body;
    await pool.query(
      'UPDATE programs SET blocks = $1 WHERE id = $2',
      [blocks, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update News
app.patch('/api/programs/:id/news', async (req, res) => {
  try {
    const { news } = req.body;
    await pool.query(
      'UPDATE programs SET news = $1 WHERE id = $2',
      [news, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Default Route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
