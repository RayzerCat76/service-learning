const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

// GET all programs (this was the crashing one)
router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM programs`;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

// GET single program
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM programs WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: "Program not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch program" });
  }
});

// POST create new program
router.post('/', async (req, res) => {
  const { name, created_by } = req.body;
  try {
    await sql`
      INSERT INTO programs (name, created_by, blocks, news)
      VALUES (${name}, ${created_by}, '[]', '[]')
    `;
    res.status(201).json({ message: "Program created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create program" });
  }
});

// ✅ PATCH update program (blocks + news)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { blocks, news } = req.body;
  try {
    await sql`
      UPDATE programs
      SET blocks = ${JSON.stringify(blocks)},
          news = ${JSON.stringify(news)}
      WHERE id = ${id}
    `;
    res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update program" });
  }
});

// DELETE program
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM programs WHERE id = ${id}`;
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete program" });
  }
});

module.exports = router;
