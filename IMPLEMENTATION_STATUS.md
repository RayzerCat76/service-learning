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
- project logos are displayed in the first-screen hero area
- clicking a hero logo selects the matching project tab/content below
- project tabs switch the main project area without leaving the homepage
- the tabbed homepage is the only public project view; legacy `program.html` has been removed
- news-page back/project links return to the homepage with the originating project selected
- left-side toggleable Service Learning drawer
- each program keeps its own news
- global newest-three published-news strip, newest first, horizontally scrollable
- dedicated news article pages
- news title, overview, content, publication time, draft/published state
- news background image URL or upload
- modular program-page editor
- modular news-layout editor
- text/image/sign-up blocks
- true free X/Y desktop positioning
- no automatic guide snapping
- visual resize handle plus exact X/Y/width/height controls
- intentional overlap support with Bring to front
- font-family selector
- text-size control
- native single-swatch color pickers for text/background/border colors
- visible-border on/off control
- editor-only dotted outline for borderless blocks
- background image per modular block
- shared `renderer.js` used by admin, homepage project content, and news pages
- responsive mobile stacking
- legacy block compatibility for old `x`, `y`, `w`, `h`, shorthand colors and border strings
- migration notes for replacing Neon/auth with school services
- build-time JavaScript/config syntax validation

## Build verification

The Vercel deployment runs `scripts/validate.js` during install. It validates:

- `renderer.js`
- `api/programs.js`
- `api/_auth.js`
- `api/auth/login.js`
- `api/auth/logout.js`
- inline script in `admin.html`
- inline script in `index.html`
- inline script in `news.html`
- JSON configuration

## Interactive verification still required

Before production merge, use an authenticated preview session to verify:

1. Master/owner/editor permissions.
2. Save + reload behavior for free X/Y layout.
3. Hero logo → matching project tab/content.
4. Project-tab switching without leaving the homepage.
5. News article → back to originating homepage project tab.
6. Left drawer behavior.
7. Background images and modular article blocks.
8. Desktop and phone widths visually.
9. Exact Seeds of Hope donation service once supplied by the school.

No production merge should happen until those protected-preview checks are completed.