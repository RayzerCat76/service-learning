import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set in Vercel environment variables");
    }

    const sql = neon(process.env.DATABASE_URL);
    const { username, password } = await req.json();

    const result = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    if (result.length === 0) {
      return res.json({ success: false, error: "Invalid username or password" });
    }

    return res.json({
      success: true,
      name: result[0].name,
      role: result[0].role
    });

  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
}
