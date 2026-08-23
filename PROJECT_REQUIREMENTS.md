# YCIS Service Learning Platform — Source of Truth

This file is the source of truth for the Service Learning prototype. It combines the original IB-project brief with the later permissions, modular-editor, logo, news, layout, and migration requirements.

## 0. Original product brief — preserve this architecture

The original prototype concept must remain recognizable even as features are added:

- **Home page first:** explain the purpose of the website and present a prominent wall/grid of Service Learning project logos.
- **Project discovery through logos:** visitors click a project logo/icon to open that project's page.
- **Project tabs:** project pages provide a horizontally accessible set of project tabs/icons so visitors can switch projects without returning home.
- **News is page-based:** news cards are previews/links; a news story opens on its own dedicated page rather than expanding inline on the home page.
- **Accessible scrollable news:** the home page shows a horizontally scrollable latest-news area.
- **Service Learning sidebar:** keep contextual information about Service Learning visible on the home page.
- **Seeds of Hope:** reserve a clear sidebar area for the school's Seeds of Hope / donation service. During prototype development this may remain a connection placeholder until the exact school donation URL/service is supplied.
- **Growth across campuses/locations:** keep an area explaining that the platform can expand across YCIS campuses/locations.
- **YCIS visual language:** use the YCIS navy/red/white family and a polished school-community aesthetic.
- **Historical milestone:** the original brief targeted a prototype by the end of May 1. This is retained as project history, not a current delivery date.

Later features must not replace the home-page logo wall with a single selected-project page or turn public news into inline accordion content.

## 1. Product goal

Create one public YCIS Service Learning website containing all Service Learning projects available at school. The site should help students and families understand what projects exist, what each project does, how to participate, and what projects have recently done.

Project owners should be able to manage their own project without needing design expertise, while a master administrator can edit every program. The editor should be fast, visual, modular, and difficult to break.

The prototype backend should stay intentionally lightweight and portable so the frontend can later be connected to the school's database, identity system, network services, media storage, and donation services without a frontend rewrite.

## 2. Public information architecture

### 2.1 Home page (`index.html`)

The home page is a discovery page, not a project-detail page. It contains:

1. YCIS-branded header and concise explanation of the site's purpose.
2. A **prominent Service Learning project logo wall**.
3. Logo cards that open dedicated project pages.
4. A global latest-news area containing **at most the three newest published stories**, newest first/left, horizontally scrollable.
5. A sidebar containing:
   - Service Learning context/purpose
   - Seeds of Hope / donation portal connection area
   - growth across YCIS campuses/locations
6. Responsive behavior for desktop, tablet, and phone.

The logo wall grows automatically as programs are added. Actual saved project logos are used; initials are only a fallback.

### 2.2 Project pages (`program.html`)

Each project opens as its own page-style view.

- The selected project occupies the main content area.
- The top of the page provides horizontally accessible project tabs/icons so users can switch projects.
- The project page displays the saved modular project layout.
- Each project displays only its own published news.
- Project news appears as cards/previews that link to dedicated news pages.
- A visitor can return to the home/project wall easily.

### 2.3 News pages (`news.html`)

Each published article has its own page-style view.

- title
- program identity
- publication date
- overview
- full content
- modular content blocks
- optional overall background image
- link/back-navigation to the associated project

News must not require an admin account to read once published.

### 2.4 Global latest news

- Pull published news from all Service Learning programs.
- Show no more than three items on the home page.
- Sort by publication timestamp descending.
- Newest appears on the left.
- Horizontally scrollable and keyboard reachable.
- Each card identifies its program and links to that story's dedicated news page.

## 3. User roles and permissions

### Master administrator

- Can sign in to the admin portal.
- Can see every Service Learning program.
- Can edit every program's name/tab, logo, content/layout, and news without being added as a collaborator.
- Program deletion remains owner-only unless explicitly changed later.

### Program owner / creator

- Creator automatically becomes owner.
- Can see and edit their program.
- Can edit name/tab, logo, modular page, and program news.
- Can assign/remove additional staff editors.
- Is the only normal account that can permanently delete the program.

### Program collaborator / editor

- Must be explicitly granted access by the owner.
- Can edit the assigned program's name/tab, logo, content/layout, and news.
- Cannot delete the program.
- Cannot transfer ownership.
- Cannot grant/revoke collaborators.
- Cannot manage unassigned programs.

### Security rules

- Write permissions are checked server-side.
- Passwords use hashes rather than new plaintext storage.
- Sessions are signed/secure.
- Public reads require no site account.
- Admin program lists are permission-scoped; master sees all.

## 4. Program data and default template

Each program needs at least:

- unique ID
- public program name/tab label
- owner identity
- collaborator identities
- program logo
- modular layout data
- program-specific news

The prototype may keep this portable in the current programs row/JSON structure; the school migration may normalize it later.

A newly created program begins with:

1. **Basic Information**
2. **How to Sign Up**
3. **News**

This is a starting template, not a fixed column layout.

## 5. Admin portal

After sign-in:

- master sees all programs
- owners see owned plus shared programs
- collaborators see shared plus owned programs
- the UI indicates Owner / Editor / Master access

For an editable program, permitted users can change:

- program name / public tab label
- logo
- page/layout
- news

Owner-only controls:

- add collaborator
- remove collaborator
- delete program

The admin should provide direct preview links to the associated public project/news pages.

## 6. Modular visual editor

Program pages and news layouts use the same modular editing model and the same public renderer.

### Workflow

- live canvas
- add-block palette
- click block to select
- drag blocks to reorder
- move blocks horizontally
- resize blocks
- edit precise values in a properties panel
- no HTML/CSS knowledge required

### Flexible positioning and limited snapping

The editor must not force blocks into only 25/50/75/100 percent widths or highly regular positions.

- Width can be set in **1% increments** within safe limits.
- Horizontal position can be set in **1% increments**.
- Common guides are 0%, 25%, 50%, 75%, and 100%.
- A value snaps to a common guide **only when it is within 2 percentage points** of that guide.
- Outside that small snap range, irregular positioning is preserved.
- Existing legacy `x`/`w` percentage layouts should remain visually compatible.
- On narrow/mobile screens, blocks may safely stack full-width rather than preserve desktop offsets that would overflow.

### Block controls

Applicable blocks support:

- block type: text, image, sign-up/link
- title/text content
- image URL/upload
- link URL/label
- exact width
- horizontal position
- minimum height
- font family
- font size
- text alignment
- text color
- background color
- optional block background image
- border on/off
- border color
- border width

### Borders and guides

- Visible border can be enabled/disabled.
- A borderless block still shows a dotted editor-only outline while editing.
- Editor guides never appear publicly.

### Color controls

- Use one clear native color swatch/well per color property rather than the old multi-dot interaction.
- The control should be large enough to click comfortably.

## 7. News editor

News is created inside the selected program's admin area.

Each article supports:

- create/delete
- title
- short overview
- full content
- publication date/time
- draft/published state
- optional article background image URL/upload
- modular layout blocks
- text/font/size/colors
- block backgrounds/images
- border controls and dotted editor guides
- flexible position/size controls using the same limited-snap behavior as program pages
- public preview link to its dedicated news page

## 8. Preview/public parity

This is mandatory.

- Admin preview and public program/news pages use one shared layout schema and `renderer.js` logic.
- Editor-only handles/guides are layered on top of the shared renderer.
- Saved width, position, typography, colors, borders, and background images should look materially the same publicly.
- Responsive rules must prevent overlap/overflow on smaller screens.

## 9. School migration boundary

The current prototype backend should remain simple. Migration should be able to replace or adapt:

- authentication/session source
- staff/permission lookup
- programs/news persistence
- logo/image storage
- Seeds of Hope/donation URL or service
- campus/location data

The public page structure, admin editing experience, modular JSON layout, and shared renderer should remain reusable.

## 10. Acceptance checklist

V1 is functionally complete when:

- [x] Home page explains the site's purpose.
- [x] Home page prominently displays the Service Learning logo wall.
- [x] Clicking a logo opens that project's dedicated page.
- [x] Project pages provide project tabs/icons for switching projects.
- [x] Home page includes Service Learning / Seeds of Hope / campus-growth sidebar areas.
- [x] YCIS navy/red visual language is used.
- [x] Global news shows up to the three newest published stories and is horizontally scrollable.
- [x] News cards open dedicated news pages rather than expanding inline.
- [x] Each program displays only its own project news.
- [x] Program logo can be edited and appears on the public logo wall/tabs.
- [x] Program name/tab can be edited.
- [x] New program starts with Basic Information, How to Sign Up, and News.
- [x] Program and news editors are modular and visual.
- [x] Blocks support 1% width and horizontal-position values.
- [x] Snapping is limited to within 2% of common guides.
- [x] Blocks can be moved/reordered/resized.
- [x] Text size and font can be changed.
- [x] Text/background/border colors use clear single color controls.
- [x] Borders can be enabled/disabled.
- [x] Borderless blocks show dotted editor-only guides.
- [x] News can use an overall background image.
- [x] Admin preview and public project/news rendering share the same renderer.
- [x] Master admin can edit every program.
- [x] Program owner can edit own program and assign/remove editors.
- [x] Assigned editor can edit assigned programs but cannot manage editors/delete.
- [x] Only owner can delete a program under current requirements.
- [x] Server-side authorization protects writes.
- [ ] Exact school Seeds of Hope/donation service is connected (requires school URL/service details).
- [ ] Protected Vercel preview receives a final authenticated browser click-through on desktop and phone before production merge.

## 11. Production rule

Do not merge this prototype to `main` solely because the build is green. Complete the protected-preview interaction check first, especially login/permissions, save-and-refresh behavior, project navigation, dedicated news navigation, and desktop/mobile rendering.
