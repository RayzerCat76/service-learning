# YCIS Service Learning Platform — Source of Truth

This file is the source of truth for the Service Learning prototype. It combines the original IB-project brief with the later permissions, modular editor, logo, news, layout and migration requirements.

Historical original target: **prototype by end of 5/1**. Keep this as project-history context even though development has continued beyond that original target.

## 0. Current non-negotiable product direction — 2026-08-24

These points supersede earlier wording where they conflict.

### Language
- All **user-facing copy** uses British English.
- Use **programme**, **colour**, **centre**, etc. in the interface.
- Internal API, database and JavaScript compatibility keys may retain existing names such as `program`, `color` and `center`; those are implementation details and must not be renamed merely for spelling consistency if doing so risks breaking stored data.

### Public visual language
- The public website should feel like a cohesive, established editorial/product website rather than a dashboard assembled from cards.
- Avoid unnecessary rounded rectangles, floating cards, shadows and boxed modules.
- Prefer large typography, generous whitespace, clear hierarchy, full-width/continuous sections, simple lines/dividers and integrated imagery.
- The desired design principle is similar to established pre-generative-AI product sites such as Apple: restrained, polished, content-led and integrated. Do **not** copy Apple branding, exact layouts or proprietary visual assets.
- YCIS navy/red/white remains the base visual language.
- Public content modules are **borderless by default**. Borders remain an intentional editor option rather than the starting state.
- Shared rendered links should feel integrated with the page rather than defaulting to pill-shaped buttons.

### Homepage information architecture
- The homepage hero is the first screen.
- Service Learning programme logos appear directly within the open hero area and visually belong to the hero background; they must not sit inside a separate white card/container.
- Clicking a hero logo selects the corresponding programme and moves the visitor to the programme area below.
- Directly below the hero is a horizontally accessible set of programme tabs.
- Switching a programme tab changes the main content underneath without leaving the homepage.
- The tabbed homepage is the **only public programme view**. The legacy standalone `program.html` page must not exist or be linked.
- Programme-specific deep links use homepage state, e.g. `/?program=<id>#programmes`. The `program` query parameter is retained as an internal compatibility key.
- News opens on dedicated `news.html` article pages.
- Returning from a news article goes directly to the homepage with the originating programme selected.

### Left navigation drawer
- The information/navigation sidebar is a toggleable drawer from the **left**.
- Every Service Learning programme is directly visible in the drawer as a logo/name row.
- Selecting a programme in the drawer closes it and opens that programme in the homepage tabbed area.
- The drawer also contains Seeds of Hope and future campus/location expansion information.
- It must work with keyboard dismissal and on mobile.

## 1. Product goal

Create one public YCIS Service Learning website containing all Service Learning programmes available at school. Programme owners should be able to manage their own programme without design expertise, while a master administrator can edit every programme.

The editing experience should be fast, visual, modular and difficult to break. The public page should preserve the layout created in the editor across desktop and mobile.

## 2. Roles and permissions

### Master administrator
- Can sign in to the admin portal.
- Can see and edit every Service Learning programme.
- Can edit programme name/tab, logo, programme content and news.
- Does not need to be explicitly added as a collaborator.
- Programme deletion remains owner-only unless explicitly changed later.

### Programme owner / creator
- The account that creates a programme becomes its owner.
- Can edit that programme's name/tab, logo, page layout and news.
- Can assign or revoke other staff editors.
- Is the only normal user who can permanently delete that programme.
- Ownership is enforced server-side.

### Programme collaborator / editor
- Must be explicitly granted access by the programme owner.
- Can edit the assigned programme's name/tab, logo, page layout and news.
- Cannot delete the programme, transfer ownership or manage collaborators.
- Cannot access unassigned programmes in the admin portal.

### Security rules
- All write permissions are checked server-side.
- Passwords are stored as secure hashes.
- Authentication uses a secure session.
- Public visitors need no account to view programmes and published news.
- Admin API responses expose only programmes the signed-in account may manage, except master sees all.

## 3. Programme data

Each Service Learning programme needs at least:
- unique ID
- programme name / public tab label
- owner account
- assigned collaborator accounts
- logo
- modular programme layout
- programme-specific news articles
- created/updated timestamps where useful

A default programme template includes:
1. Basic Information
2. How to Sign Up
3. News

These default modules start **borderless** and may be moved, resized or restyled.

## 4. Public website (`index.html`)

### Hero programme logos
- Programme logos are visible in the hero/first-screen area.
- They are visually integrated into the hero rather than enclosed in a card.
- Each logo is clickable and selects the corresponding programme tab/content below.
- The logo area supports additional programmes as the list grows.

### Programme tabs and selected content
- All programmes appear as accessible tabs with actual programme logo/name.
- Tabs use a simple navigation treatment such as typography/underline rather than pill-card styling.
- Selecting a tab switches the main content without leaving the homepage.
- Only the selected programme occupies the main content area.
- Each programme keeps its own content and news.
- There is no standalone public programme page.

### Programme rendering
- Render the modular layout stored by the admin editor.
- Preserve block X position, Y position, width, height, typography, colours, borders, background images and responsive behaviour.
- Public rendering and admin preview use the same layout schema/renderer.
- Borderless modules should visually blend into the surrounding page rather than look like cards.
- On smaller screens, layouts reflow safely rather than overlap or overflow.

### Global latest news
- Keep a global latest-news section containing news from all programmes.
- Show at most the three newest published articles overall.
- Newest item appears on the left.
- The area is horizontally scrollable when necessary.
- News previews should use an editorial/list treatment with whitespace and dividers rather than generic rounded cards.
- Each item identifies its programme and opens the associated dedicated news page.

### Programme-specific news
- Each programme has its own news section in the selected programme area.
- Programme A news must not appear as Programme B news.
- News supports title, overview, full content, images, modular layout, background image and publication time.
- Published news opens on its own `news.html` page.
- News-page return links restore the originating homepage programme state using `/?program=<id>#programmes`.

## 5. Left toggleable drawer

- Slides in/out from the left side.
- Does not permanently consume desktop content width.
- Shows **every Service Learning programme directly**, each with logo/name.
- Programme rows navigate to the matching homepage programme tab.
- Contains Service Learning navigation/context.
- Contains the Seeds of Hope donation-portal area.
- Contains growth/expansion into additional campuses or locations.
- Uses simple dividers/list structure instead of stacking boxed cards.
- Is keyboard-dismissable and usable on mobile.

## 6. Admin portal (`admin.html`)

After sign-in:
- master sees all programmes
- owner sees programmes they own plus programmes shared with them
- collaborator sees only programmes shared with them (and any they own)
- each programme shows Owner, Editor or Master relationship

Editable programme settings:
- programme name/tab label
- programme logo
- programme page/layout
- programme news

Owner-only settings:
- add collaborator
- remove collaborator
- delete programme

Programme logo:
- can be changed from admin
- appears in the homepage hero logo area, left drawer and programme tabs
- admin shows current logo and replacement preview
- initials fallback only when no logo exists

User-facing admin terminology must use British English. Internal IDs and data keys remain compatible with the current API.

## 7. Modular visual editor

The programme editor and news editor follow the same modular editing model.

### Editing workflow
- large live canvas/preview
- block palette / Add Block controls
- click a block to edit properties
- freely move blocks horizontally and vertically on desktop
- resize blocks easily
- preview closely matches published result
- no HTML/CSS knowledge required

### Free positioning
- Desktop blocks use independent X and Y positions instead of row-based document flow.
- Dragging supports both horizontal and vertical movement.
- There is **no automatic magnet/snap behaviour** to grid or guide positions.
- X position can be controlled precisely as a percentage.
- Y position can be controlled precisely in pixels.
- Width and height have direct numeric controls as well as drag resizing.
- Overlap is allowed when intentionally designed; selected blocks can be brought to the front.
- On phone widths, desktop-positioned blocks stack safely into readable full-width flow.

### Block defaults and controls
Newly added blocks start **borderless**. Staff can deliberately enable a border when the design calls for one.

Every applicable block supports:
- title/text content
- X and Y position
- width and height
- text size
- font family
- text colour
- background colour
- optional background image
- border on/off
- border colour and width
- alignment where applicable

### Borders and editor guides
- Visible border can be turned on/off.
- Borderless blocks still show a dotted editor-only outline in admin.
- The dotted guide never appears publicly.

### Colour picker
- Use one clear native colour swatch/picker per colour control.
- Avoid the old confusing multi-dot colour UI.

## 8. News editor

For each news item:
- create/delete article
- title
- short overview
- full content
- images
- optional overall background image
- modular content blocks
- text/font/size/colour controls
- block backgrounds/images
- border on/off + editor-only dotted guides
- free X/Y positioning and visual resizing
- publication timestamp/order

New article blocks also start borderless.

## 9. Preview/public parity

Mandatory acceptance requirement:
- Admin preview and public programme rendering use one shared layout schema and renderer.
- Editor-only controls/guides are layered on top of that renderer.
- Desktop, tablet and phone layouts must be tested.

## 10. Migration direction

The prototype may keep lightweight portable metadata while awaiting school-system migration. The eventual school-backed model can normalise users, programme owners/editors, logos, layout records and news while preserving the frontend API contract.

Internal compatibility note: the existing database/API currently uses names such as `programs`, `created_by`, `program` query parameters and US-English implementation keys. These do not need to be renamed during prototype development; only user-facing language is required to be British English.

## 11. Acceptance checklist

- [ ] Master admin can edit every programme.
- [ ] Programme owner can edit their programme.
- [ ] Programme owner can assign/remove editors.
- [ ] Assigned editor can edit only assigned programmes.
- [ ] Unassigned user cannot access private admin data or modify a programme through direct API calls.
- [ ] Only the owner can delete their programme under normal permissions.
- [ ] Programme name/tab can be edited.
- [ ] Programme logo can be edited and appears in hero logos, drawer and tabs.
- [ ] New programme starts with Basic Information, How to Sign Up and News.
- [ ] New/default modules are borderless unless a border is deliberately enabled.
- [ ] Programme logos are integrated into the first-screen hero rather than displayed in a separate card.
- [ ] Hero logo click selects the matching programme/tab.
- [ ] Programme tabs switch main content without leaving the homepage.
- [ ] No standalone legacy programme page exists or is linked.
- [ ] News-page return links restore the originating homepage programme tab.
- [ ] Left drawer opens/closes and directly lists every Service Learning programme.
- [ ] Each programme displays only its own news.
- [ ] Global latest area shows the three newest published items, newest left, and is scrollable.
- [ ] Published news opens on a dedicated news page.
- [ ] Public pages avoid unnecessary rounded-card/dashboard styling.
- [ ] Programme and news editors are modular and visual.
- [ ] Blocks move freely in both X and Y directions on desktop.
- [ ] No automatic guide snapping occurs while moving blocks.
- [ ] Blocks can be resized in width and height.
- [ ] Exact X, Y, width and height can be entered numerically.
- [ ] Text size and font can be changed.
- [ ] Text/background colours use clear single colour pickers.
- [ ] Borders can be enabled/disabled.
- [ ] Borderless blocks show dotted editor-only guides.
- [ ] Public pages never show editor-only dotted guides.
- [ ] User-facing copy uses British English throughout.
- [ ] Admin preview and public rendering match closely.
- [ ] Desktop, tablet and phone layouts do not become distorted unexpectedly.
- [ ] Authentication and authorisation are enforced server-side.
