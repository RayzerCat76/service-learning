# YCIS Service Learning Platform — Consolidated Requirements

This file is the source of truth for the Service Learning platform before further implementation. It combines the original brief (the requirements beginning with “I am an IB student…”) with the later permission, editor, layout, logo, border, color, and news requirements.

## 1. Product goal

Create one public YCIS Service Learning website containing all Service Learning projects available at school. Project owners should be able to manage their own project without needing design expertise, while a master administrator can edit every project.

The editing experience should be fast, visual, modular, and difficult to break. The public page should preserve the layout created in the editor across desktop and mobile.

## 2. User roles and permissions

### 2.1 Master administrator

- Can sign in to the admin portal.
- Can see every Service Learning program.
- Can open and edit every program, including its tab/name, logo, program content, and news.
- Does not need to be explicitly added as a collaborator.
- Program deletion remains owner-only unless this requirement is explicitly changed later.

### 2.2 Program owner / creator

- The account that creates a Service Learning program becomes its owner.
- Can see and edit that program.
- Can edit the program tab/name, logo, program page/layout, and all news belonging to that program.
- Can assign or revoke other staff accounts as editors/collaborators for that program.
- Is the only normal user who can permanently delete that program.
- Ownership must be enforced by the server, not only hidden/shown in the browser UI.

### 2.3 Program collaborator / editor

- Must be explicitly granted access by the program owner.
- Can edit the assigned program’s tab/name, logo, page content/layout, and news.
- Cannot delete the program.
- Cannot transfer ownership.
- Cannot grant/revoke collaborators unless this requirement is explicitly changed later.
- Cannot access unassigned programs in the admin portal.

### 2.4 Security rules

- All write permissions are checked server-side.
- Passwords are stored as secure hashes.
- Authentication uses a secure session.
- Public visitors need no account to view programs and published news.
- Admin API responses should expose only the programs the signed-in account may manage, except that the master administrator sees all programs.

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

A default program template should include:

1. Basic Information
2. How to Sign Up
3. News

The owner/editor may add, remove, resize, reorder, or restyle modular blocks rather than being forced into a fixed two-column layout.

## 4. Public website (`index.html`)

### 4.1 Program navigation

- All Service Learning programs appear as selectable tabs/cards/icons with their actual program logo.
- Selecting a program switches the main content to that program.
- The selected program should occupy the main page/content area rather than displaying every program as simultaneous columns.
- Each program keeps its own content and its own news.

### 4.2 Program page rendering

- Render the modular layout stored by the admin editor.
- Preserve relative block position, size, typography, colors, borders, background images, and responsive behavior.
- The public renderer and admin preview should use the same layout rules/schema so that the index page does not become distorted compared with the preview.
- On smaller screens, layouts must reflow safely rather than overlap or overflow.

### 4.3 Global latest-news banner

- Keep a global latest-news section/banner containing news from all Service Learning programs.
- Show at most the three newest published news articles overall.
- Newest item appears on the left.
- The banner is horizontally scrollable when necessary.
- Each item identifies its program and opens/selects the associated program/news item.

### 4.4 Program-specific news

- Each program has its own news section.
- News created while editing Program A must not appear as Program B’s project news.
- News can contain a title, short overview, full content, images, and a modular layout.
- News may use an image as the article/page background.

## 5. Admin portal (`admin.html`)

### 5.1 Login/dashboard

After sign-in:

- master administrator sees all programs
- owner sees programs they own plus programs shared with them
- collaborator sees only programs shared with them (and any they own)
- each program shows the user’s relationship: Owner, Editor, or Master Admin

### 5.2 Program settings

For an editable program, users with permission can change:

- program name/tab label
- program logo
- program page/layout
- program news

Owner-only settings:

- add collaborator
- remove collaborator
- delete program

### 5.3 Program logo

- Program logo can be changed from the admin page.
- Public program selector/tab/icon uses that saved logo.
- Editor should show the current logo and a preview of the replacement before saving.
- A fallback based on initials may be used only when no logo is configured.

## 6. Modular visual editor

The program editor and news editor should follow the same modular editing model.

### 6.1 Editing workflow

- large live canvas/preview
- block palette or Add Block control
- click a block to edit its properties
- drag/reorder/move blocks
- resize blocks easily
- preview should closely match the published result
- changes should not require writing HTML/CSS

### 6.2 Block controls

Every applicable block should support:

- title/text content
- block width and height / easy visual resizing
- text size
- text font/family
- text color
- background color
- optional background image
- border on/off
- border color
- reasonable border width/style controls
- alignment where applicable

### 6.3 Borders and editor guides

- User can turn a visible border on or off.
- When the saved/published border is OFF, the admin preview still shows a dotted editor-only outline so the user can see the block’s region.
- The dotted editor guide must never appear on the public website.

### 6.4 Color picker

- Replace the confusing multi-dot color UI with one clear color control/well that opens a color wheel/picker.
- The color well should be an obvious single swatch/button.
- Background and text color each use this same interaction.

### 6.5 Block size

- Users can change block dimensions visually with resize handles.
- Width/height should also have understandable values/controls when useful.
- Resizing in the editor must translate predictably to the public page.

### 6.6 Font controls

- Provide a font-family dropdown with approved/browser-safe fonts.
- Provide text-size controls with understandable values.
- Typography selected in the editor must render the same way publicly.

## 7. News editor

News is created inside the selected Service Learning program’s admin area.

For each news item:

- create/delete article
- title
- short overview for cards/banner
- full content
- images
- optional overall background image
- modular content blocks
- text/font/size/color controls
- block background colors/images
- border on/off and editor-only dotted guides
- visual block resizing/reordering
- publication ordering/timestamp so newest news can be determined globally

## 8. Default templates

### 8.1 Program template

A newly created program starts with a friendly template containing:

- Basic Information
- How to Sign Up
- News

The template is a starting point, not a fixed layout.

### 8.2 News template

A new news article starts with a simple usable structure such as:

- title/hero area
- overview/body area
- optional image area

Users can modify it using the same modular editor.

## 9. Preview/public parity

This is a mandatory acceptance requirement because the current public formatting can become inconsistent with the admin editor.

- The admin preview and public page must be driven by one shared layout schema/rendering logic.
- Do not maintain one unrelated layout implementation for `admin.html` and another for `index.html`.
- Editor-only controls/guides are layered on top of the same rendered block model.
- Responsive rules must be tested at desktop, tablet, and phone widths.

## 10. Current implementation gap summary

As of branch `agent/stabilize-v1`:

### Present or partially present

- public program listing
- program-specific stored blocks and news
- basic program create/edit/delete UI
- basic movable/resizable editor concept
- basic text/background color selection
- news creation and news images by URL
- secure login/session work in progress
- master/teacher roles exist in the database

### Missing or not correctly enforced

- owner-only access control
- per-program collaborator assignment
- owner-only deletion
- true master-admin override logic
- admin list filtered by permissions
- program logo storage/editing
- program tab/name editing after creation
- actual logos on public program tabs/icons
- full-page program tab behavior based on the requested design
- default Basic Information + How to Sign Up + News template
- global newest-three-news scrollable banner
- publication timestamps/order for global news
- news background image setting
- modular font controls
- text-size controls
- border on/off control
- dotted editor-only block outlines when borders are disabled
- single clear color-wheel/well interaction
- robust preview/public layout parity
- responsive modular rendering that prevents the public format from becoming distorted

## 11. Data-model direction

The current `created_by` text field is not sufficient for robust permissions. The intended model should move toward:

- `users`
- `programs` with an owner user ID and logo reference
- `program_editors` mapping programs to additional permitted users
- program layout data
- news records belonging to one program, with publication timestamps and modular layout data

Exact database migration details should be implemented and tested separately before production deployment.

## 12. Acceptance checklist

V1 feature-complete means all of the following are true:

- [ ] Master admin can edit every program.
- [ ] Program owner can edit their program.
- [ ] Program owner can assign/remove editors.
- [ ] Assigned editor can edit only assigned programs.
- [ ] Unassigned user cannot read private admin data or modify a program through direct API calls.
- [ ] Only the program owner can delete their program under normal user permissions.
- [ ] Program name/tab can be edited.
- [ ] Program logo can be edited and appears publicly.
- [ ] New program starts with Basic Information, How to Sign Up, and News.
- [ ] Program page uses full main-content area when selected.
- [ ] Each program displays only its own project news.
- [ ] Global banner displays the three newest news items, newest on the left, and is scrollable.
- [ ] News background image can be selected.
- [ ] Program and news editors are modular and visual.
- [ ] Blocks can be resized.
- [ ] Text size can be changed.
- [ ] Font can be changed.
- [ ] Text/background colors use a clear single color picker/well.
- [ ] Borders can be enabled/disabled.
- [ ] Borderless blocks show dotted editor-only region guides.
- [ ] Public page never shows editor-only dotted guides.
- [ ] Admin preview and public rendering match closely.
- [ ] Desktop, tablet, and phone layouts do not overlap or become distorted.
- [ ] Authentication and authorization are enforced on the server.
