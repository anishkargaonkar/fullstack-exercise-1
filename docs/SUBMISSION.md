# TaskBoard - Kanban Project Management Application

## Overview

A fullstack Kanban-style project management application built with Next.js 16 frontend and Python FastAPI backend.

## Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **State Management:** React hooks with optimistic updates

### Backend
- **Framework:** FastAPI (Python 3.11)
- **Database:** SQLite with raw SQL queries
- **API Format:** RESTful JSON

## Project Structure

```
fullstack-exercise-1/
├── frontend/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS imports
│   │   ├── layout.tsx           # Root layout with fonts
│   │   └── page.tsx             # Main page with layout structure
│   ├── components/
│   │   ├── Header.tsx           # Fixed top header with search
│   │   ├── Sidebar.tsx          # Fixed left sidebar with navigation
│   │   ├── ProjectHeader.tsx    # Project title, tabs, filters
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.tsx  # 4-column board container
│   │   │   ├── KanbanColumn.tsx # Individual status column
│   │   │   └── TaskCard.tsx     # Task card with menu
│   │   └── ui/
│   │       ├── Avatar.tsx       # User avatar component
│   │       ├── Badge.tsx        # Notification badge
│   │       └── Button.tsx       # Reusable button
│   ├── hooks/
│   │   └── useTasks.ts          # Task data fetching & mutations
│   ├── lib/
│   │   ├── api.ts               # API client functions
│   │   └── types.ts             # TypeScript interfaces
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── database.py          # SQLite connection
│   │   ├── routes/
│   │   │   └── tasks.py         # Tasks CRUD endpoints
│   │   └── schemas/
│   │       └── task.py          # Pydantic models
│   ├── migrations/
│   │   ├── 001_create_health_table.sql
│   │   └── 002_create_tasks_table.sql
│   └── requirements.txt
├── docker-compose.yaml
└── docs/
    └── SUBMISSION.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |
| GET | `/health` | Health check |

## Data Model

### Task
```typescript
interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'launched';
  priority: 'normal' | 'high';
  due_date: string | null;
  assignees: string[];
  created_at: string;
  updated_at: string;
}
```

## Features Implemented

### UI Components
- [x] Fixed header with logo, search bar, notifications, user avatar
- [x] Fixed sidebar with workspace selector, navigation, project tree
- [x] Project header with title, tabs, filter dropdowns
- [x] Kanban board with 4 status columns (Pending, In Progress, Completed, Launched)
- [x] Task cards with title, assignees, due date, priority indicator
- [x] Dropdown menu on cards for status change and delete

### Functionality
- [x] Fetch and display tasks from API
- [x] Group tasks by status into columns
- [x] Change task status via dropdown menu
- [x] Delete tasks
- [x] Optimistic updates for better UX
- [x] Loading and error states
- [x] Responsive column layout

### Backend
- [x] SQLite database with tasks table
- [x] CRUD API endpoints
- [x] Seeded with 12 sample tasks
- [x] CORS enabled for frontend

## Running the Application

### With Docker (Recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Without Docker

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python migrate.py upgrade
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Architecture Decisions

1. **Data/UI Separation:** Custom `useTasks` hook handles all data fetching and mutations, keeping components focused on presentation.

2. **Optimistic Updates:** Status changes and deletes update UI immediately, rolling back on API failure.

3. **Fixed Layout:** Header and Sidebar use fixed positioning for consistent navigation while content scrolls.

4. **Tailwind v4:** Using the new CSS-first configuration approach with `@import "tailwindcss"`.

5. **SQLite:** Chosen for simplicity in this exercise; easily swappable for PostgreSQL in production.

## Known Limitations

- Tailwind CSS styling may have issues in Docker production build due to v4 content scanning
- No drag-and-drop between columns (status change via dropdown only)
- Filters are static UI (not functional)
- No authentication/authorization

## Time Spent

~90 minutes total implementation time.
