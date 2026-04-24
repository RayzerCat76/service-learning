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
// Add this at the bottom of your api/programs.js file

// ✅ New endpoint to update a single program (blocks + news)
app.patch('/api/programs/:id', async (req, res) => {
  const programId = req.params.id;
  const { blocks, news } = req.body;

  try {
    await sql`
      UPDATE programs
      SET blocks = ${JSON.stringify(blocks)},
          news = ${JSON.stringify(news)}
      WHERE id = ${programId}
    `;

    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update program" });
  }
});
