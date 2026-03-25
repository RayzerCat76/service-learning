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
    const { id, title, content, bg, text, border } = JSON.parse(body);

    await sql`
      UPDATE blocks
      SET title = ${title}, content = ${content}, bg = ${bg}, text = ${text}, border = ${border}
      WHERE id = ${id}
    `;

    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
}
