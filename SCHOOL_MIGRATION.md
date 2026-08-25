# School Migration Notes

The current implementation is intentionally lightweight so the YCIS Service Learning frontend can be moved to a school-managed database, authentication system, or internal network without redesigning the pages.

## Frontend contract

The public page only needs:

- `GET /api/programs`

The admin page uses:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/programs?admin=1`
- `POST /api/programs`
- `PATCH /api/programs/:id`
- `DELETE /api/programs/:id`

If the school replaces Neon or the current login system, keeping these response shapes means `index.html` and `admin.html` can remain mostly unchanged.

## Current program shape

A program is returned approximately as:

```json
{
  "id": 4,
  "name": "Example Program",
  "created_by": "teacher.username",
  "blocks": [],
  "news": [],
  "accessRole": "owner"
}
```

`created_by` is currently the owner username. The school can replace this with a directory/user ID later; only the backend permission check needs to change.

## Portable metadata

To avoid adding prototype-only database tables, program metadata is stored as a hidden item inside the existing `blocks` JSON array:

```json
{
  "id": "__meta__",
  "type": "meta",
  "logo": "https://... or data:image/...",
  "editors": ["teacher.a", "student.leader"]
}
```

The public API removes the editor list before returning data to visitors.

For a school migration, this can be split into normal database fields/tables if preferred:

- programs.owner_id
- programs.logo_url
- program_editors(program_id, user_id)

The frontend does not need to know how those are stored as long as the API returns equivalent data.

## Modular block shape

Program pages and news layouts share the same block schema:

```json
{
  "id": "block_123",
  "type": "text",
  "title": "Basic Information",
  "content": "...",
  "width": 100,
  "minHeight": 180,
  "bg": "#ffffff",
  "text": "#172e5c",
  "fontFamily": "Arial",
  "fontSize": 16,
  "align": "left",
  "borderEnabled": true,
  "borderColor": "#d9dee7",
  "borderWidth": 1,
  "backgroundImage": ""
}
```

Additional block types currently used are `image` and `signup`. This JSON can be stored in JSON/JSONB, a document database, or normalized relational tables.

## News shape

News remains inside each program for this prototype:

```json
{
  "id": "news_123",
  "title": "News title",
  "overview": "Short card summary",
  "content": "Full article text",
  "publishedAt": "2026-08-24T00:00:00.000Z",
  "published": true,
  "backgroundImage": "",
  "layoutBlocks": []
}
```

The homepage gathers all program news, sorts by `publishedAt`, and shows the newest three published items.

The school can later create a dedicated `news` table with a `program_id` foreign key without changing the user interface.

## Permission rules to preserve

- master admin: edit every program
- owner/creator: edit own program, manage editors, delete own program
- assigned editor: edit assigned program but cannot manage editors or delete it
- public visitor: read published program content only

These rules are currently enforced by `api/programs.js`, not just by hiding buttons in the browser.

## Files most likely to be replaced during migration

- `api/_auth.js` — replace with school SSO/session verification
- `api/auth/login.js` — replace or remove when SSO is used
- `api/auth/logout.js` — replace or remove when SSO is used
- `api/programs.js` — replace Neon queries with school database/service calls

## Files designed to stay

- `renderer.js` — shared layout renderer
- `admin.html` — modular editor UI
- `index.html` — public Service Learning site

The goal is that migration changes the adapter/backend layer, not the visual editor or public experience.
