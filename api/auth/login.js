const { neon } = require("@neondatabase/serverless");
const { hashPassword, matchesLegacyPassword, matchesPassword, setSessionCookie } = require("../_auth");

const sql = neon(process.env.DATABASE_URL);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

    const rows = await sql`SELECT id, username, role, password, password_hash FROM users WHERE username = ${username} LIMIT 1`;
    const user = rows[0];
    if (!user || !["master", "teacher"].includes(user.role)) return res.status(401).json({ error: "Invalid username or password" });

    const validHash = user.password_hash && matchesPassword(password, user.password_hash);
    const validLegacy = !user.password_hash && matchesLegacyPassword(password, user.password);
    if (!validHash && !validLegacy) return res.status(401).json({ error: "Invalid username or password" });

    if (validLegacy) {
      await sql`UPDATE users SET password_hash = ${hashPassword(password)}, password = ${`migrated:${user.id}`}, password_updated_at = now() WHERE id = ${user.id}`;
    }
    setSessionCookie(res, user);
    return res.status(200).json({ user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error("Admin login failed", error);
    return res.status(500).json({ error: "Unable to sign in" });
  }
};
