const crypto = require("crypto");

const SESSION_COOKIE = "ycis_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const HASH_ITERATIONS = 310000;

function getSecret() {
  if (!process.env.ADMIN_SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return process.env.ADMIN_SESSION_SECRET;
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").map((item) => item.trim()).filter(Boolean).map((item) => {
      const index = item.indexOf("=");
      return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
    })
  );
}

function createSession(user) {
  const payload = base64url(JSON.stringify({ id: user.id, username: user.username, role: user.role, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }));
  return `${payload}.${sign(payload)}`;
}

function getSession(req) {
  try {
    const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
    if (!token) return null;
    const [payload, signature] = token.split(".");
    if (!payload || !signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(payload)))) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch {
    return null;
  }
}

function setSessionCookie(res, user) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${createSession(user)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}${secure}`);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, 32, "sha256").toString("hex");
  return `pbkdf2$${HASH_ITERATIONS}$${salt}$${derived}`;
}

function matchesPassword(password, stored) {
  const [algorithm, iterations, salt, digest] = String(stored || "").split("$");
  if (algorithm !== "pbkdf2" || !iterations || !salt || !digest) return false;
  const derived = crypto.pbkdf2Sync(password, salt, Number(iterations), 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(digest, "hex"));
}

function matchesLegacyPassword(password, stored) {
  const supplied = Buffer.from(String(password));
  const expected = Buffer.from(String(stored || ""));
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

function requireStaff(req, res) {
  const session = getSession(req);
  if (!session || !["master", "teacher"].includes(session.role)) {
    res.status(401).json({ error: "Staff sign-in required" });
    return null;
  }
  return session;
}

module.exports = { clearSessionCookie, getSession, hashPassword, matchesLegacyPassword, matchesPassword, requireStaff, setSessionCookie };
