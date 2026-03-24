import { sql } from './db.js';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { username, password } = await req.json();
  const users = await sql`
    SELECT * FROM users WHERE username = ${username} AND password = ${password}
  `;
  if (users.length === 0) return res.json({ success: false });
  const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET);
  res.json({
    success: true,
    token,
    name: users[0].name,
    role: users[0].role
  });
};
