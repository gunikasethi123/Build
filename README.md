# BuildSphere — Student Project Workspace

A React + Vite frontend and Express + MySQL backend starter with a modern workspace UI.

## Features included
- Dashboard overview with project/task/deadline metrics
- Projects: create, search, priority, status, due date, progress
- Tasks: create, assign to a project/member, set due date and status
- Team members: add people and choose a role
- Files: upload attachments to the backend, list and download them
- Calendar: see tasks and project deadlines
- Analytics: completion overview and status breakdown
- Activity: basic recent activity feed
- Task comments
- Roles field (Admin, Project Lead, Member, Viewer)
- Responsive sidebar/navigation
- Demo mode when the API/MySQL is not configured; uses browser localStorage

## Requirements
- Node.js 20 or newer recommended
- MySQL 8 recommended
- VS Code

## Mac setup
1. Download and unzip this folder.
2. Open VS Code → File → Open Folder → select `BuildSphere_Full_Project`.
3. Open Terminal → New Terminal.
4. Run:
   ```bash
   npm install
   ```
5. Optional: set up MySQL:
   - Start MySQL server.
   - Copy `.env.example` to `.env`.
   - Fill in `DB_USER`, `DB_PASSWORD`, and other settings.
   - Create the database (or run the schema below):
     ```bash
     mysql -u root -p < server/schema.sql
     ```
     If your MySQL account is not `root`, replace it with your username.
6. Start both frontend and backend:
   ```bash
   npm run dev:all
   ```
7. Open `http://localhost:5173`.

### Run frontend only
```bash
npm run dev
```
This starts the UI in demo mode. It stores changes in localStorage, so it works without MySQL.

### Run backend only
```bash
cp .env.example .env
# edit .env
npm run server
```
Backend URL: `http://localhost:4000/api/health`.

## Project structure
```text
BuildSphere_Full_Project/
├── src/
│   ├── components/       # Sidebar, modal, reusable UI
│   ├── data/             # demo seed data
│   ├── hooks/            # app state and API/localStorage adapter
│   ├── pages/            # dashboard, projects, tasks, team, files, calendar, analytics, activity
│   ├── styles/            # CSS
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── routes/            # API routes
│   ├── middleware/        # upload middleware
│   ├── db.js
│   ├── index.js
│   └── schema.sql
└── .env.example
```

## Important notes
- This starter has a demo-mode data adapter so the interface is testable before MySQL setup.
- File upload is real when the backend is running; files are saved in `server/uploads/`.
- The API includes project, task, team, file, comment, and activity endpoints.
- For a public/production deployment, add authentication, authorization middleware, file size/type limits appropriate to your needs, validation, and secure secrets management. The role field in this starter is not a security boundary by itself.
- To keep this beginner-friendly, the starter uses a small REST API and straightforward React state. You can explain each page and endpoint in viva.
