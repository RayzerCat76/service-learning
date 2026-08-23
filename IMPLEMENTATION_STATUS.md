# Implementation Status

Branch: `agent/stabilize-v1`

## Implemented

- master administrator can edit every program
- creator/owner can edit their own program
- creator/owner can add and remove editor usernames
- assigned editors can edit assigned programs
- admin program list is filtered by access permission
- owner-only program deletion enforced by the API
- server-side write authorization
- program name/tab editing
- program logo URL or image upload with public rendering
- default Basic Information, How to Sign Up, and News blocks for new programs
- one selected program occupies the main public project area
- each program keeps its own news
- global newest-three published-news strip, newest first, horizontally scrollable
- news title, overview, content, publication time, draft/published state
- news background image URL or upload
- modular program-page editor
- modular news-layout editor
- text/image/sign-up blocks
- drag-to-reorder blocks
- visual resize handle plus width/height controls
- font-family selector
- text-size control
- native single-swatch color pickers for text/background/border colors
- visible-border on/off control
- editor-only dotted outline for borderless blocks
- background image per modular block
- shared `renderer.js` used by both admin preview and public page
- responsive shared rendering for desktop/mobile
- legacy block compatibility for old `w`, shorthand colors and border strings
- old programs automatically gain portable metadata when edited
- migration notes for replacing Neon/auth with school services
- build-time JavaScript/config syntax validation

## Build verification

The Vercel deployment runs `scripts/validate.js` during install. It currently passes:

- `renderer.js`
- `api/programs.js`
- `api/_auth.js`
- `api/auth/login.js`
- `api/auth/logout.js`
- inline script in `admin.html`
- inline script in `index.html`
- JSON configuration

## Interactive verification still required

The preview deployment is protected by Vercel Authentication. The available automated browser environment cannot pass that protection, so the following end-to-end checks still need an authenticated browser session before production merge:

1. Login with the master account and confirm both existing programs are visible.
2. Login with the teacher/owner account and confirm only owned/shared programs are visible.
3. Add the other staff user as an editor and verify editor access.
4. Verify an editor cannot delete a program or change the editor list.
5. Rename a program and change its logo; confirm the public preview updates.
6. Edit blocks, borders, fonts, sizes and colors; confirm admin/public parity.
7. Create three or more news items across programs and verify the global newest-three order.
8. Verify article background images and modular article blocks.
9. Check desktop and phone widths visually.

No production merge should happen until those protected-preview checks are completed.
