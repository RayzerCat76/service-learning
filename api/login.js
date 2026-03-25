import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 跨域必须写
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 连接数据库（绝对正确写法）
    const sql = neon(process.env.DATABASE_URL);

    // 读取前端传过来的账号密码
    const { username, password } = await req.json();

    // 查询数据库（绝对安全写法）
    const result = await sql`
      SELECT * FROM users
      WHERE username = ${username}
      AND password = ${password}
    `;

    // 没找到 → 登录失败
    if (result.length === 0) {
      return res.json({ success: false });
    }

    // 找到了 → 登录成功
    return res.json({
      success: true,
      name: result[0].name,
      role: result[0].role
    });

  } catch (e) {
    // 服务器错误 → 返回详细信息让你知道为什么炸
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
}
