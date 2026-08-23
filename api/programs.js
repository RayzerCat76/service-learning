const { neon } = require('@neondatabase/serverless');
const { requireStaff } = require('./_auth');

const sql = neon(process.env.DATABASE_URL);

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function getProgramId(req) {
  const pathname = String(req.url || '').split('?')[0];
  const match = pathname.match(/^\/api\/programs\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

module.exports = async (req, res) => {
  const id = getProgramId(req);

  try {
    if (req.method === 'GET') {
      if (id) {
        const rows = await sql`SELECT * FROM programs WHERE id = ${id} LIMIT 1`;
        if (!rows.length) return res.status(404).json({ error: 'Program not found' });
        return res.status(200).json(rows[0]);
      }

      const rows = await sql`SELECT * FROM programs ORDER BY id`;
      return res.status(200).json(rows);
    }

    const staff = requireStaff(req, res);
    if (!staff) return;

    if (req.method === 'POST' && !id) {
      const body = parseBody(req);
      const name = String(body.name || '').trim();
      if (!name) return res.status(400).json({ error: 'Program name is required' });

      const createdBy = staff.username;
      const rows = await sql`
        INSERT INTO programs (name, created_by, blocks, news)
        VALUES (${name}, ${createdBy}, '[]', '[]')
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PATCH' && id) {
      const body = parseBody(req);
      if (!Array.isArray(body.blocks) || !Array.isArray(body.news)) {
        return res.status(400).json({ error: 'blocks and news must be arrays' });
      }

      const rows = await sql`
        UPDATE programs
        SET blocks = ${JSON.stringify(body.blocks)},
            news = ${JSON.stringify(body.news)}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Program not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE' && id) {
      const rows = await sql`DELETE FROM programs WHERE id = ${id} RETURNING id`;
      if (!rows.length) return res.status(404).json({ error: 'Program not found' });
      return res.status(200).json({ message: 'Deleted' });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Programs API failed', error);
    return res.status(500).json({ error: 'Unable to process programs request' });
  }
};
