# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Project Overview

Habit Tracker allows users to:
- Sign up and log in with email and password
- Create, edit, and delete daily habits
- Mark habits complete for today and track streaks
- View a responsive dashboard (sidebar on desktop, navbar on mobile)
- Toggle between light and dark mode
- Install the app on their device as a PWA
- Use the app offline after the first load

All data is stored locally in the browser using localStorage — no external database or authentication service.

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### Install dependencies
```bash
npm install
```

### Install Playwright browsers
```bash
npx playwright install
```

---

## Run Instructions

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production build
```bash
npm run build
npm run start
```

---

## Test Instructions

### Run all tests
```bash
npm test
```

### Unit tests only (with coverage report)
```bash
npm run test:unit
```

### Integration tests only
```bash
npm run test:integration
```

### End-to-end tests only
```bash
# Make sure dev server is running first
npm run dev

# Then in a separate terminal
npm run test:e2e
```

---

## Local Persistence Structure

All data is stored in `localStorage` under these exact keys:

| Key | Shape | Description |
|-----|-------|-------------|
| `habit-tracker-users` | `User[]` | All registered users |
| `habit-tracker-session` | `Session \| null` | Currently logged in user |
| `habit-tracker-habits` | `Habit[]` | All habits across all users |

### User shape
```json
{
  "id": "string",
  "email": "string",
  "password": "string",
  "createdAt": "string"
}
```

### Session shape
```json
{
  "userId": "string",
  "email": "string"
}
```

### Habit shape
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "description": "string",
  "frequency": "daily",
  "createdAt": "string",
  "completions": ["YYYY-MM-DD"]
}
```

---

## PWA Implementation

The app is installable and works offline via two files:

**`public/manifest.json`** — tells the browser the app name, icon, colors, and start URL so it can be installed on a device home screen.

**`public/sw.js`** — a service worker that caches the app shell on first load. On subsequent visits without internet, it serves cached pages instead of showing an error.

The service worker is registered in `src/app/layout.tsx` via an inline script that runs on the client after page load.

---

## Trade-offs and Limitations

- **No real authentication** — passwords are stored in plain text in localStorage. This is intentional per the requirements (local-only, no backend).
- **No encryption** — localStorage data is readable by anyone with browser access.
- **Single device only** — data does not sync across devices or browsers.
- **Daily frequency only** — habit frequency is locked to daily as per Stage 3 requirements.
- **No password reset** — since there is no backend, forgotten passwords cannot be recovered.
- **Theme persistence** — dark/light mode preference is saved to localStorage under `habit-tracker-theme`.

---

## Test File Map

| Test file | What it verifies |
|-----------|-----------------|
| `tests/unit/slug.test.ts` | `getHabitSlug()` converts habit names to URL-safe slugs correctly |
| `tests/unit/validators.test.ts` | `validateHabitName()` rejects empty and too-long names with correct messages |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak()` counts consecutive completed days and handles edge cases |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion()` adds/removes dates without mutating the original habit |
| `tests/unit/storage.test.ts` | localStorage helpers correctly read and write users, sessions, and habits |
| `tests/integration/auth-flow.test.tsx` | Signup, login, duplicate email error, and invalid credentials UI behavior |
| `tests/integration/habit-form.test.tsx` | Habit creation, editing, deletion confirmation, completion toggle, and streak display |
| `tests/e2e/app.spec.ts` | Full user flows: auth, habit CRUD, persistence after reload, offline support |

---

## Implementation Map

| Requirement | Implementation |
|-------------|---------------|
| Routes `/`, `/login`, `/signup`, `/dashboard` | `src/app/*/page.tsx` via Next.js App Router |
| localStorage persistence | `src/lib/storage.ts` |
| Auth logic | `src/lib/auth.ts` + `src/components/auth/` |
| Habit logic | `src/lib/habits.ts` + `src/components/habits/` |
| Streak calculation | `src/lib/streaks.ts` |
| Slug generation | `src/lib/slug.ts` |
| Name validation | `src/lib/validators.ts` |
| PWA support | `public/manifest.json` + `public/sw.js` |
| Protected routes | `src/components/shared/ProtectedRoute.tsx` |
| Responsive layout | `src/components/shared/AppShell.tsx` |