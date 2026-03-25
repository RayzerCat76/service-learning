import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  const {id}=await req.json();
  await sql`DELETE FROM blocks WHERE id=${id}`;
  res.json({success:true});
};
