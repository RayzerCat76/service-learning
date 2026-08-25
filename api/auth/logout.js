const { clearSessionCookie } = require("../_auth");

module.exports = (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  clearSessionCookie(res);
  return res.status(204).end();
};
