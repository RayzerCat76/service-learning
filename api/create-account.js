import { sql } from './db.js';

export default async (req, res) => {
  const { username, password } = await req.json();
  try {
    await sql`
      INSERT INTO users (username, password, name, role)
      VALUES (${username}, ${password}, ${username}, 'teacher')
    `;
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
};
