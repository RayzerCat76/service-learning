const { Pool } = require('pg');

module.exports = async (req, res) =>
{
  try
  {
    // FORCE PRINT THE CONNECTION STRING (for debug only)
    const conString = process.env.DATABASE_URL;
    let masked = conString ? conString.substring(0,30)+"..." : "NOT SET";

    // CONNECT
    const pool = new Pool({
      connectionString: conString,
      ssl: { rejectUnauthorized: false }
    });

    // CHECK WHAT TABLES EXIST
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    // CHECK ROWS IN programs
    const data = await pool.query("SELECT * FROM programs");

    // RETURN EVERYTHING
    res.status(200).json({
      envWorking: !!conString,
      connectionPreview: masked,
      tablesInDatabase: tables.rows.map(t => t.table_name),
      programCount: data.rows.length,
      programs: data.rows
    });
  }
  catch (err)
  {
    res.status(500).json({
      error: "FULL DEBUG ERROR",
      details: err.message,
      stack: err.stack
    });
  }
};
