import { sql } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    await new Promise(resolve => req.on('end', resolve));
    const { id, x, y, w, h } = JSON.parse(body);

    await sql`
      UPDATE blocks
      SET x = ${x}, y = ${y}, w = ${w}, h = ${h}
      WHERE id = ${id}
    `;

    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
}
