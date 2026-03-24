import { getDB } from './db';
import jwt from 'jsonwebtoken';

export default async function(req,res) {
  const { username, password } = await req.json();
  const sql = getDB();
  const user = await sql`
    SELECT * FROM users WHERE username = ${username} AND password = ${password}
  `;
  if (user.length === 0) return res.json({ success:false });
  const token = jwt.sign({ id:user[0].id }, process.env.JWT_SECRET);
  res.json({
    token, name:user[0].name, role:user[0].role
  });
}
