import { sql } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const program_id = req.query.program_id;
  res.json(await sql`SELECT * FROM blocks WHERE program_id = ${program_id}`);
}
