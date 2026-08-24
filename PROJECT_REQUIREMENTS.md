# YCIS Service Learning Platform — Source of Truth

This file is the source of truth for the Service Learning prototype. It combines the original IB-project brief with later permissions, modular-editor, logo, news, layout, and migration requirements.

Historical original target: **prototype by end of 5/1**. Keep this as project-history context even though development has continued beyond that original target.

## 0. Latest confirmed public information architecture — 2026-08-24

These points supersede earlier homepage-navigation wording where they conflict:

- The homepage hero remains the first screen, with the Service Learning project logos placed prominently in the open area on the right side of the hero.
- Clicking a hero project logo selects that program and moves the visitor to the project-tab area below.
- Immediately below the hero is a horizontally accessible set of Service Learning project tabs.
- Switching a project tab changes the main project content area underneath without leaving the homepage.
- The tabbed homepage is the only public project view. The legacy standalone `program.html` page must not exist or be linked.
- News cards open dedicated `news.html` article pages.
- Returning from a news article goes directly to the homepage with the originating project tab selected.
- The informational sidebar is not a permanently visible right column. It is a toggleable drawer that slides in/out from the left side.
- The left drawer contains Service Learning context/navigation, Seeds of Hope donation-portal space, and growth into additional campuses/locations.
- The homepage keeps the accessible, horizontally scrollable global latest-news area.
- YCIS navy/red/white remains the base visual language.

## 1. Product goal

Create one public YCIS Service Learning website containing all Service Learning projects available at school. Project owners should be able to manage their own project without needing design expertise, while a master administrator can edit every project.

The editing experience should be fast, visual, modular, and difficult to break. The public page should preserve the layout created in the editor across desktop and mobile.

## 2. User roles and permissions

### Master administrator
- Can sign in to the admin portal.
- Can see and edit every Service Learning program.
- Can edit program tab/name, logo, program content, and news.
- Does not need to be explicitly added as a collaborator.
- Program deletion remains owner-only unless explicitly changed later.

### Program owner / creator
- The account that creates a program becomes its owner.
- Can edit that program's name/tab, logo, page layout, and news.
- Can assign or revoke other staff editors.
- Is the only normal user who can permanently delete that program.
- Ownership is enforced server-side.

### Program collaborator / editor
- Must be explicitly granted access by the program owner.
- Can edit the assigned program's name/tab, logo, page layout, and news.
- Cannot delete the program, transfer ownership, or manage collaborators.
- Cannot access unassigned programs in the admin portal.

### Security rules
- All write permissions are checked server-side.
- Passwords are stored as secure hashes.
- Authentication uses a secure session.
- Public visitors need no account to view programs and published news.
- Admin API responses expose only programs the signed-in account may manage, except master sees all.

## 3. Program data

Each Service Learning program needs at least:
- unique ID
- program name / public tab label
- owner account
- assigned collaborator accounts
- logo
- modular program-page layout
- program-specific news articles
- created/updated timestamps where useful

A default program template includes:
1. Basic Information
2. How to Sign Up
3. News

The owner/editor may add, remove, resize, reposition, or restyle modular blocks rather than being forced into a fixed grid or two-column layout.

## 4. Public website (`index.html`)

### Hero project logos
- Project logos are visible in the hero/first-screen area, not buried below the fold.
- Each logo is clickable and selects the corresponding project tab/content below.
- The logo area supports additional projects as the list grows.

### Program tabs and selected content
- All programs appear as accessible tabs with actual program logo/name.
- Selecting a tab switches the main content area to that program without leaving the homepage.
- Only the selected program occupies the main content area.
- Each program keeps its own content and news.
- There is no standalone public project page. Project-specific deep links use the homepage query/hash state, e.g. `/?program=<id>#projects`.

### Program rendering
- Render the modular layout stored by the admin editor.
- Preserve block X position, Y position, width, height, typography, colors, borders, background images, and responsive behavior.
- Public rendering and admin preview use the same layout schema/renderer.
- On smaller screens, layouts reflow safely rather than overlap or overflow.

### Global latest news
- Keep a global latest-news section containing news from all programs.
- Show at most the three newest published articles overall.
- Newest item appears on the left.
- The area is horizontally scrollable when necessary.
- Each item identifies its program and opens the associated dedicated news page.

### Program-specific news
- Each program has its own news section in the selected project area.
- Program A news must not appear as Program B project news.
- News supports title, overview, full content, images, modular layout, background image, and publication time.
- Published news opens on its own `news.html` page.
- News-page back/project links return directly to `/?program=<id>#projects` so the originating project remains selected.

### Left toggleable sidebar/drawer
- The sidebar is a drawer that slides in/out from the left side.
- It does not permanently consume desktop content width.
- It contains Service Learning context/navigation.
- It contains the Seeds of Hope donation-portal area.
- It contains growth/expansion into additional campuses or locations.
- It is keyboard-dismissable and usable on mobile.

## 5. Admin portal (`admin.html`)

After sign-in:
- master sees all programs
- owner sees programs they own plus programs shared with them
- collaborator sees only programs shared with them (and any they own)
- each program shows Owner, Editor, or Master relationship

Editable program settings:
- program name/tab label
- program logo
- program page/layout
- program news

Owner-only settings:
- add collaborator
- remove collaborator
- delete program

Program logo:
- can be changed from admin
- appears in the homepage hero logo area and project tabs
- admin shows current logo and replacement preview
- initials fallback only when no logo exists

## 6. Modular visual editor

The program editor and news editor follow the same modular editing model.

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
- There is **no automatic magnet/snap behavior** to grid or guide positions.
- X position can be controlled precisely as a percentage.
- Y position can be controlled precisely in pixels.
- Width and height have direct numeric controls as well as drag resizing.
- Overlap is allowed when intentionally designed; selected blocks can be brought to the front.
- On phone widths, desktop-positioned blocks stack safely into readable full-width flow.

### Block controls
Every applicable block supports:
- title/text content
- X and Y position
- width and height
- text size
- font family
- text color
- background color
- optional background image
- border on/off
- border color and width
- alignment where applicable

### Borders and editor guides
- Visible border can be turned on/off.
- Borderless blocks still show a dotted editor-only outline in admin.
- The dotted guide never appears publicly.

### Color picker
- Use one clear native color swatch/picker per color control.
- Avoid the old confusing multi-dot color UI.

## 7. News editor

For each news item:
- create/delete article
- title
- short overview
- full content
- images
- optional overall background image
- modular content blocks
- text/font/size/color controls
- block backgrounds/images
- border on/off + editor-only dotted guides
- free X/Y positioning and visual resizing
- publication timestamp/order

## 8. Default templates

### Program template
New program starts with:
- Basic Information
- How to Sign Up
- News

These are starting blocks, not a fixed layout, and begin at non-overlapping X/Y positions.

### News template
New article begins with a simple usable content block and can be expanded with the same modular editor.

## 9. Preview/public parity

Mandatory acceptance requirement:
- Admin preview and public program rendering use one shared layout schema and renderer.
- Editor-only controls/guides are layered on top of that renderer.
- Desktop, tablet, and phone layouts must be tested.

## 10. Migration direction

The prototype may keep lightweight portable metadata while awaiting school-system migration. The eventual school-backed model can normalize users, program owners/editors, logos, layout records, and news while preserving the frontend API contract.

## 11. Acceptance checklist

- [ ] Master admin can edit every program.
- [ ] Program owner can edit their program.
- [ ] Program owner can assign/remove editors.
- [ ] Assigned editor can edit only assigned programs.
- [ ] Unassigned user cannot access private admin data or modify a program through direct API calls.
- [ ] Only the owner can delete their program under normal permissions.
- [ ] Program name/tab can be edited.
- [ ] Program logo can be edited and appears in hero logos and tabs.
- [ ] New program starts with Basic Information, How to Sign Up, and News.
- [ ] Project logos are visible in the first-screen hero area.
- [ ] Hero logo click selects the matching project/tab.
- [ ] Project tabs switch main content without leaving the homepage.
- [ ] No standalone legacy project page exists or is linked.
- [ ] News-page return links restore the originating homepage project tab.
- [ ] Left sidebar/drawer opens and closes correctly.
- [ ] Each program displays only its own news.
- [ ] Global latest area shows the three newest published items, newest left, and is scrollable.
- [ ] Published news opens on a dedicated news page.
- [ ] Program and news editors are modular and visual.
- [ ] Blocks move freely in both X and Y directions on desktop.
- [ ] No automatic guide snapping occurs while moving blocks.
- [ ] Blocks can be resized in width and height.
- [ ] Exact X, Y, width, and height can be entered numerically.
- [ ] Text size and font can be changed.
- [ ] Text/background colors use clear single color pickers.
- [ ] Borders can be enabled/disabled.
- [ ] Borderless blocks show dotted editor-only guides.
- [ ] Public pages never show editor-only dotted guides.
- [ ] Admin preview and public rendering match closely.
- [ ] Desktop, tablet, and phone layouts do not become distorted unexpectedly.
- [ ] Authentication and authorization are enforced server-side.