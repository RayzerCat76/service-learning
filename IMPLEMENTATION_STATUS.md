# Implementation Status

Branch: `agent/stabilize-v1`

## Implemented

### Permissions and backend
- master administrator can edit every program
- creator/owner can edit their own program
- creator/owner can add and remove editor usernames
- assigned editors can edit assigned programs
- admin program list is filtered by access permission
- owner-only program deletion enforced by the API
- server-side write authorization
- program name/tab editing
- program logo URL or image upload
- lightweight portable backend remains suitable for later school-system migration

### Homepage/public structure
- YCIS navy/red/white visual language
- first-screen hero includes the Service Learning project-logo area on the right
- hero logos select the corresponding project/tab below
- horizontally accessible project tabs directly below the hero
- tabs switch the selected project content without leaving the homepage
- selected project renders its own modular page and its own news
- dedicated `program.html` remains available as a shareable/direct project URL
- dedicated `news.html` for published news articles
- global newest-three published-news strip, newest first, horizontally scrollable
- toggleable left-side Service Learning drawer
- drawer contains Service Learning context/navigation, Seeds of Hope portal space, and campus/location growth

### Modular editor
- program-page and news-layout editors use the shared `renderer.js`
- desktop blocks use independent X/Y positioning rather than row-based flow
- no automatic guide snapping
- four-direction free-move handle
- separate resize handle
- exact horizontal X percentage input
- exact vertical Y pixel input
- exact width percentage and height pixel inputs
- intentional overlap supported with Bring to front
- text/image/sign-up blocks
- font-family selector
- text-size control
- native single-swatch color pickers
- visible-border on/off control
- editor-only dotted outline for borderless blocks
- background image per modular block
- old `x`, `y`, `w`, `h`, shorthand colors and border strings remain compatible
- mobile safely stacks positioned blocks full-width

### News
- news title, overview, full content, publication time, draft/published state
- news background image URL or upload
- modular free-positioned article blocks
- public project news stays scoped to its own program
- public news opens on a dedicated article page

### Verification
- Vercel install runs `scripts/validate.js`
- syntax validation covers renderer, API/auth, admin inline JS, homepage inline JS, project-page inline JS, news-page inline JS, and JSON config
- latest free-X/Y + hero-logo + tabbed-home build passed Vercel validation and deployed READY

## Interactive verification still required before production merge

1. Open the exact latest Vercel preview rather than an older branch preview tab.
2. Confirm hero logos appear inside the first-screen right-side area.
3. Confirm clicking a hero logo selects/scrolls to the matching project tab.
4. Confirm tabs switch the project content area without leaving the homepage.
5. Confirm the left SL Menu drawer opens/closes and contains all three required areas.
6. In Admin → Page Design, drag the ✥ handle horizontally and vertically and confirm there is no snapping.
7. Save, reload, and confirm X/Y positions persist publicly.
8. Resize blocks and confirm width/height persist.
9. Check intentional overlap + Bring to front.
10. Verify master / owner / collaborator permissions.
11. Verify desktop and phone rendering.
12. Connect the exact Seeds of Hope donation service when supplied by the school.

No production merge should happen until these protected-preview checks are completed.
