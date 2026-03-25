import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  const progs=await sql`SELECT * FROM programs`;
  for(const p of progs)p.blocks=await sql`SELECT * FROM blocks WHERE program_id=${p.id}`;
  res.json({programs:progs});
};
