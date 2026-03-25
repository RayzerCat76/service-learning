import { sql } from './db.js';

export default async function handler(req, res) {
  // 必须先设置跨域头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 正确解析请求体
    const { username, password } = await req.json();

    // 查询数据库
    const result = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    // 返回 JSON 响应
    if (result.length === 0) {
      return res.json({ success: false });
    }
    return res.json({ success: true, name: result[0].name });

  } catch (error) {
    console.error('Login error:', error);
    // 确保返回 JSON 格式的错误
    return res.status(500).json({ success: false, error: error.message });
  }
}
