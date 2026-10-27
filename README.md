# Campus Lost & Found Portal
**WDD Mini Project** built using HTML, CSS, JavaScript, Node.js and Express.

## Features
- Report lost or found campus items
- Search by item name, category, description or location
- Filter by type, category and status
- Upload a small optional item photo
- Contact the reporter through the device's email app
- Mark reports as resolved or reopen them
- Store records in a local JSON file
- Responsive layout for desktop and mobile

## Requirements
- Node.js 18 or later
- npm (included with Node.js)
- A modern web browser

## Run locally
1. Extract the project ZIP.
2. Open the `campus_lost_found` folder in VS Code.
3. Open the terminal in that folder.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   npm start
   ```
6. Open `http://localhost:3000` in your browser.

Keep the terminal running while you use the site. Do not open `index.html` directly; the website needs the Node.js server for its API.

## Data storage
On first run, the server creates `data/items.json` with a few demonstration listings. New reports and status changes are saved in this file. Back up this file before deleting or resetting demo data.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/items` | List items; supports `q`, `type`, `category`, `status` query parameters |
| POST | `/api/items` | Create a lost/found report |
| PATCH | `/api/items/:id/resolve` | Toggle an item between open and resolved |

## Important project limitations
This is a classroom demo, not a production service. It does not have student login, identity verification, access control, or a database server. The contact email is visible to people who can view the listing. Use sample/demo contact details for a class presentation and do not publish sensitive personal information. For real campus deployment, add authentication, admin moderation, privacy controls, secure image storage, and a database.

## Suggested submission details
**Project title:** Campus Lost & Found Portal  
**Domain:** Web Development  
**Frontend:** HTML5, CSS3, JavaScript  
**Backend:** Node.js, Express  
**Storage:** JSON file  
**Purpose:** To help students report, search and reconnect with lost and found belongings on campus.


## Visual style
The interface uses a polished pastel-lavender and blush theme, rounded cards, soft gradients, subtle hover effects and a responsive layout.


## Troubleshooting JSON / submit errors
- Start the site using `START_HERE.bat`; do not double-click `index.html`.
- Keep the terminal window open while submitting reports.
- Open `http://localhost:3000` in the browser.
- If another app is already using port 3000, stop it before starting this project.
- Photos must be JPG, PNG, or WebP and under 65 KB.
