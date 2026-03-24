import { sql } from './db.js';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  // SET HEADERS (FIXES CORS / BUGS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { username, password } = await req.json();
    const users = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    if (users.length === 0) {
      return res.json({ success: false });
    }

    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
      name: users[0].name
    });

  } catch (e) {
    res.json({ success: false, error: e.message });
  }
};
