# LMS (Learning Management System)

Minimal, content-first LMS built with Next.js 14, Prisma, MySQL, and JWT auth. Designed for Cursor / Vibe workflows with server-side "workflows" callable directly from the UI.

## Features

- Authentication with email + password (hashed with bcrypt) and JWT access/refresh tokens in HTTP-only cookies.
- Subjects, sections, and videos with strict ordered progression per subject.
- YouTube-based video player that resumes from last watched time and auto-advances on completion.
- Sidebar showing sections, videos, and locked/completed state.
- Profile page summarizing enrolled subjects and overall video completion.
- Health endpoint at `/health` returning `{ status: "ok" }`.

## Tech Stack

- Next.js 14 (App Router, server actions)
- React 18
- Prisma ORM with MySQL
- Tailwind CSS
- jose for JWT

## Environment

Create a `.env` file based on `.env.example`:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/lms"
JWT_SECRET="a-long-random-secret-string"
```

Run Prisma migrations and start the dev server:

```bash
npm install
npx prisma migrate dev
npm run dev
```

