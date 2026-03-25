import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 跨域头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. 检查环境变量
    if (!process.env.DATABASE_URL) {
      throw new Error("❌ DATABASE_URL 未在 Vercel 环境变量中设置");
    }

    // 2. 连接数据库
    const sql = neon(process.env.DATABASE_URL);

    // 3. 解析请求体
    const { username, password } = await req.json();
    if (!username || !password) {
      throw new Error("❌ 用户名或密码不能为空");
    }

    // 4. 查询用户
    const result = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    // 5. 登录结果
    if (result.length === 0) {
      return res.json({ success: false, error: "❌ 用户名或密码错误" });
    }

    return res.json({
      success: true,
      name: result[0].name,
      role: result[0].role
    });

  } catch (err) {
    console.error("Login API Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
