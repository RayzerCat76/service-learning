import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  const {id,x,y,w,h}=await req.json();
  await sql`UPDATE blocks SET x=${x},y=${y},w=${w},h=${h} WHERE id=${id}`;
  res.json({success:true});
};
