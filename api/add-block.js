import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  const {program_id}=await req.json();
  await sql`INSERT INTO blocks (program_id,title,content,bg,text,border,x,y,w,h) VALUES (${program_id},'New Block','','#fff','#000','#ddd',20,20,60,25)`;
  res.json({success:true});
};
