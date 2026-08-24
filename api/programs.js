const { neon } = require('@neondatabase/serverless');
const { requireStaff } = require('./_auth');

const sql = neon(process.env.DATABASE_URL);
const META_ID = '__meta__';

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

function requestInfo(req) {
  const url = new URL(req.url || '/api/programs', 'http://localhost');
  const match = url.pathname.match(/^\/api\/programs\/([^/]+)\/?$/);
  return { id: match ? decodeURIComponent(match[1]) : null, admin: url.searchParams.get('admin') === '1' };
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

function metaOf(blocks) {
  return asArray(blocks).find((block) => block && block.id === META_ID) || { id: META_ID, type: 'meta', logo: '', editors: [] };
}

function editorList(program) {
  const editors = metaOf(program.blocks).editors;
  return Array.isArray(editors) ? [...new Set(editors.map(String).map((v) => v.trim()).filter(Boolean))] : [];
}

function isOwner(program, staff) {
  return String(program.created_by || '') === String(staff.username || '');
}

function canEdit(program, staff) {
  return staff.role === 'master' || isOwner(program, staff) || editorList(program).includes(staff.username);
}

function accessRole(program, staff) {
  if (isOwner(program, staff)) return 'owner';
  if (staff.role === 'master') return 'master';
  if (editorList(program).includes(staff.username)) return 'editor';
  return null;
}

function publicProgram(program) {
  const blocks = asArray(program.blocks).map((block) => {
    if (!block || block.id !== META_ID) return block;
    return { id: META_ID, type: 'meta', logo: block.logo || '' };
  });
  return { id: program.id, name: program.name, blocks, news: asArray(program.news) };
}

function defaultBlocks() {
  return [
    { id: META_ID, type: 'meta', logo: '', editors: [] },
    { id: 'basic_info', type: 'text', title: 'Basic Information', content: 'Introduce your Service Learning programme here.', width: 100, offsetX: 0, offsetY: 0, minHeight: 180, bg: '#ffffff', text: '#172e5c', fontFamily: 'Arial', fontSize: 16, align: 'left', borderEnabled: false, borderColor: '#d9dee7', borderWidth: 1, backgroundImage: '' },
    { id: 'signup', type: 'signup', title: 'How to Sign Up', content: 'Explain how students can join or help.', linkLabel: 'Sign up', linkUrl: '', width: 46, offsetX: 0, offsetY: 220, minHeight: 180, bg: '#ffffff', text: '#172e5c', fontFamily: 'Arial', fontSize: 16, align: 'left', borderEnabled: false, borderColor: '#d9dee7', borderWidth: 1, backgroundImage: '' },
    { id: 'news_intro', type: 'text', title: 'News', content: 'Published programme stories appear below and open on their own news pages.', width: 46, offsetX: 54, offsetY: 220, minHeight: 180, bg: '#ffffff', text: '#172e5c', fontFamily: 'Arial', fontSize: 16, align: 'left', borderEnabled: false, borderColor: '#e54555', borderWidth: 1, backgroundImage: '' }
  ];
}

async function getProgram(id) {
  const rows = await sql`SELECT * FROM programs WHERE id = ${id} LIMIT 1`;
  return rows[0] || null;
}

async function validateEditors(editors, owner) {
  const clean = [...new Set((Array.isArray(editors) ? editors : []).map(String).map((v) => v.trim()).filter(Boolean))].filter((username) => username !== owner);
  if (clean.length > 25) throw new Error('Too many editors');
  if (!clean.length) return clean;
  const rows = await sql`SELECT username FROM users`;
  const valid = new Set(rows.map((row) => String(row.username)));
  const missing = clean.filter((username) => !valid.has(username));
  if (missing.length) {
    const error = new Error(`Unknown staff account: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
  return clean;
}

module.exports = async (req, res) => {
  const { id, admin } = requestInfo(req);

  try {
    if (req.method === 'GET') {
      if (admin) {
        const staff = requireStaff(req, res);
        if (!staff) return;
        if (id) {
          const program = await getProgram(id);
          if (!program || !canEdit(program, staff)) return res.status(404).json({ error: 'Programme not found' });
          return res.status(200).json({ ...program, blocks: asArray(program.blocks), news: asArray(program.news), accessRole: accessRole(program, staff) });
        }
        const rows = await sql`SELECT * FROM programs ORDER BY id`;
        const allowed = rows.filter((program) => canEdit(program, staff)).map((program) => ({ ...program, blocks: asArray(program.blocks), news: asArray(program.news), accessRole: accessRole(program, staff) }));
        return res.status(200).json(allowed);
      }

      if (id) {
        const program = await getProgram(id);
        if (!program) return res.status(404).json({ error: 'Programme not found' });
        return res.status(200).json(publicProgram(program));
      }
      const rows = await sql`SELECT * FROM programs ORDER BY id`;
      return res.status(200).json(rows.map(publicProgram));
    }

    const staff = requireStaff(req, res);
    if (!staff) return;

    if (req.method === 'POST' && !id) {
      const body = parseBody(req);
      const name = String(body.name || '').trim();
      if (!name) return res.status(400).json({ error: 'Programme name is required' });
      const blocks = defaultBlocks();
      const rows = await sql`
        INSERT INTO programs (name, created_by, blocks, news)
        VALUES (${name}, ${staff.username}, ${JSON.stringify(blocks)}, '[]')
        RETURNING *
      `;
      return res.status(201).json({ ...rows[0], blocks, news: [], accessRole: 'owner' });
    }

    if (!id) {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const program = await getProgram(id);
    if (!program) return res.status(404).json({ error: 'Programme not found' });

    if (req.method === 'PATCH') {
      if (!canEdit(program, staff)) return res.status(403).json({ error: 'You do not have permission to edit this programme' });
      const body = parseBody(req);
      const currentBlocks = asArray(program.blocks);
      const proposedBlocks = Array.isArray(body.blocks) ? body.blocks : currentBlocks;
      const proposedNews = Array.isArray(body.news) ? body.news : asArray(program.news);
      const currentEditors = editorList(program).sort();
      const proposedMeta = metaOf(proposedBlocks);
      const proposedEditors = Array.isArray(proposedMeta.editors) ? proposedMeta.editors.map(String).sort() : [];
      const editorsChanged = JSON.stringify(currentEditors) !== JSON.stringify([...new Set(proposedEditors)].sort());

      if (editorsChanged && !isOwner(program, staff)) return res.status(403).json({ error: 'Only the programme owner can manage editors' });
      if (editorsChanged) proposedMeta.editors = await validateEditors(proposedEditors, String(program.created_by));

      const name = body.name === undefined ? program.name : String(body.name || '').trim();
      if (!name) return res.status(400).json({ error: 'Programme name is required' });

      const rows = await sql`
        UPDATE programs
        SET name = ${name}, blocks = ${JSON.stringify(proposedBlocks)}, news = ${JSON.stringify(proposedNews)}
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json({ ...rows[0], blocks: proposedBlocks, news: proposedNews, accessRole: accessRole(rows[0], staff) });
    }

    if (req.method === 'DELETE') {
      if (!isOwner(program, staff)) return res.status(403).json({ error: 'Only the programme owner can delete this programme' });
      await sql`DELETE FROM programs WHERE id = ${id}`;
      return res.status(200).json({ message: 'Deleted' });
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Programmes API failed', error);
    return res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Unable to process programmes request' });
  }
};
