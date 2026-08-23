# Implementation Status

Branch: `agent/stabilize-v1`

## Implemented

### Public experience

- YCIS-branded home page with clear website-purpose copy
- prominent Service Learning project logo wall on the home page
- saved project logos displayed publicly, initials only as fallback
- each logo opens a dedicated `program.html` project page
- project pages include horizontally scrollable project tabs/icons
- each project renders its saved modular page layout
- each project displays only its own published news
- each news story opens on a dedicated `news.html` page rather than expanding inline
- dedicated news pages render title, overview, date, full copy, modular blocks, and optional background image
- global home-page news strip shows at most the newest three published stories, newest first/left, horizontally scrollable
- home-page sidebar includes Service Learning context, Seeds of Hope/donation connection placeholder, and cross-campus growth area
- responsive desktop/mobile layouts

### Admin and permissions

- master administrator can edit every program
- creator/owner can edit their own program
- creator/owner can add and remove editor usernames
- assigned editors can edit assigned programs
- admin program list is filtered by access permission
- owner-only program deletion enforced by the API
- server-side write authorization
- program name/tab editing
- program logo URL or image upload
- direct public project/news preview links

### Modular editor

- shared `renderer.js` used by admin preview, project pages, and news pages
- text/image/sign-up blocks
- drag-to-reorder
- horizontal move handle
- visual resize handle
- exact 1% width values with a safe 15% minimum
- exact 1% horizontal-position values
- limited snapping: only within 2 percentage points of 0/25/50/75/100 guides
- old `x`/`w` percentage positions remain compatible with existing saved layouts
- minimum-height control
- font-family selector
- text-size control
- native single-swatch color pickers for text/background/border colors
- visible-border on/off control
- editor-only dotted outline for borderless blocks
- block background image URL/upload
- responsive mobile renderer stacks blocks safely

### News editor

- program-scoped news creation/deletion
- title, overview, full content
- publication time
- published/draft state
- article background image URL/upload
- modular news blocks using the same flexible editor and renderer

### Portability

- lightweight existing `programs` storage retained instead of adding a sophisticated migration-only backend
- owner remains represented by existing `created_by`
- logo/editor metadata stored in portable JSON metadata
- migration notes for replacing Neon/auth/media/donation integrations with school services
- obsolete Express backend removed
- build-time JavaScript/config syntax validation

## Build verification

Vercel runs `scripts/validate.js` during install. It currently validates:

- `renderer.js`
- `api/programs.js`
- `api/_auth.js`
- `api/auth/login.js`
- `api/auth/logout.js`
- inline script in `admin.html`
- inline script in `index.html`
- inline script in `program.html`
- inline script in `news.html`
- JSON configuration

The current branch build passes these syntax checks. Static home-page delivery has also been confirmed from the Vercel preview.

## Remaining external/integration items

1. Connect the exact school Seeds of Hope/donation URL or service when supplied.
2. Complete an authenticated browser click-through on the protected Vercel preview:
   - master/owner/editor permission behavior
   - save/reload edits
   - logo-wall → project-page navigation
   - project tabs
   - project-news → dedicated news-page navigation
   - free block placement and limited snapping
   - admin/public layout parity
   - desktop and phone visual check
3. Do not merge to `main` until the protected-preview interaction check passes.
