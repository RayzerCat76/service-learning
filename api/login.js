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
    const { username, password } = JSON.parse(body);

    const result = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    if (result.length === 0) {
      return res.json({ success: false, reason: "No user found" });
    }

    return res.json({ success: true, name: result[0].name });
  } catch (err) {
    return res.status(500).json({ success: false, reason: err.message });
  }
}
