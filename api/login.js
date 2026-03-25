import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  const {username,password}=await req.json();
  const r=await sql`SELECT * FROM users WHERE username=${username} AND password=${password}`;
  if(r.length===0)return res.json({success:false});
  res.json({success:true,name:r[0].name});
};
