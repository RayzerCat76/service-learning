import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // 连接数据库
    const sql = neon(process.env.DATABASE_URL);
    
    // 解析请求体
    const { username, password } = await req.json();

    // 查询用户
    const users = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    // 检查是否找到用户
    if (users.length === 0) {
      return res.json({ success: false, error: 'Invalid username or password' });
    }

    // 返回成功结果
    return res.json({
      success: true,
      name: users[0].name,
      role: users[0].role
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Server error: ' + error.message });
  }
}
