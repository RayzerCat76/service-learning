import { neon } from '@neondatabase/serverless';

// This is a serverless function, so we must export a handler
export default async function handler(req, res) {
  // 1. Allow CORS (Vercel sometimes needs this)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Handle preflight OPTIONS request (browser sends this first)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // 4. Connect to Database
    const sql = neon(process.env.DATABASE_URL);
    
    // 5. Parse Body
    const { username, password } = await req.json();

    // 6. Query Database
    const users = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    // 7. Check Result
    if (users.length === 0) {
      return res.json({ success: false, error: 'Invalid credentials' });
    }

    // 8. Success
    res.json({
      success: true,
      name: users[0].name,
      role: users[0].role
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error: ' + error.message });
  }
}
