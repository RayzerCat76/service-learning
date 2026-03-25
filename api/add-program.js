import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  const {name}=await req.json();
  await sql`INSERT INTO programs (name) VALUES (${name})`;
  res.json({success:true});
};
