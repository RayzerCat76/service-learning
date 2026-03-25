import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = neon(process.env.DATABASE_URL);
    const body = req.body || await req.json();
    const { username, password } = body;

    const result = await sql`
      SELECT * FROM users
      WHERE username = ${username} AND password = ${password}
    `;

    if (result.length === 0) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      name: result[0].name
    });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
