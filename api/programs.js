import { sql } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(await sql`SELECT * FROM programs`);
}
