import { sql } from './db.js';
export default async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  const {id,title,content,bg,text,border}=await req.json();
  await sql`UPDATE blocks SET title=${title},content=${content},bg=${bg},text=${text},border=${border} WHERE id=${id}`;
  res.json({success:true});
};
