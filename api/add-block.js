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
    const { program_id } = JSON.parse(body);

    await sql`
      INSERT INTO blocks (program_id, title, content, bg, text, border, x, y, w, h)
      VALUES (${program_id}, 'New Block', '', '#fff', '#000', '#ddd', 20, 20, 60, 25)
    `;

    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
}
