import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  const {username,password}=await req.json();
  try{
    await sql`INSERT INTO users (username,password,name,role) VALUES (${username},${password},${username},'teacher')`;
    res.json({success:true});
  }catch{e=>res.json({success:false})}
};
