import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  const {program_id}=req.query;
  res.json(await sql`SELECT * FROM blocks WHERE program_id=${program_id}`);
};
