import { sql } from './db.js';

export default async (req, res) => {
  const programs = await sql`SELECT * FROM programs`;
  for (let p of programs) {
    p.blocks = await sql`SELECT * FROM blocks WHERE program_id = ${p.id}`;
  }
  res.json({ programs });
};
