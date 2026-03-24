import { getDB } from './db';
export default async function(req,res) {
  const { program_id } = await req.json();
  const sql = getDB();
  await sql`
    INSERT INTO blocks (program_id, title, content, bg, text, border, x, y, w, h)
    VALUES (${program_id}, 'New Block', '', '#ffffff', '#000000', '#dddddd', 20, 20, 60, 25)
  `;
  res.json({ success:true });
}
