# duely

A simple assignment planner built in React from the *Assignment 3: Sprint 1 UI Design* deck.

| Route   | Page             | What it does |
|---------|------------------|--------------|
| `/`     | Due soon (Home)  | Assignments grouped **Overdue / This week / Later**, soonest first. The circle marks one done; Done keeps an undo on every row, and a confirmation strip offers a one-click undo. Shows the empty state until something is saved. |
| `/add`  | New assignment   | Name, class (+ optional color), due date (today pre-filled), and an optional note (e.g. the pasted instructions). Save with a required field blank only flags the field and saves nothing. |
| `/guide/:id` | Study guide | Opened from the "Study guide →" link on each row. A day-by-day plan for the days left, with the assignment's note underneath (long notes fold behind "show all"). |
| `/help` | How it works     | One-page guide to adding, finishing/undoing, reading the list, and study guides. |

Study guides are the app's main benefit (inclusivity heuristic #1), so it's explained up front on the
empty state and the Add page, before the user has to try anything.

## Run it

```bash
npm install
npm run dev          # Express + Vite with hot reload, at http://localhost:5173
```

Production: `npm run build`, then `npm start` (Express serves `dist/`). Set `PORT` to change the port.

## Where data lives

Assignments are kept in the browser's `localStorage`. All reads and writes go through `src/api.js`,
which is async, so it can be pointed at a real backend later without changing any page code.
Nothing is ever deleted.

## Project layout

```
src/
  api.js            data layer (localStorage for now)
  dates.js          due-date math and formatting
  colors.js         class color options
  navigation.js     shared "cancel, go back" behaviour
  components/       Layout, PageTitle, AssignmentRow, DoneList, UndoStrip, EmptyState
  assets/           sad-calendar.svg, squiggle.svg, check.svg, check-white.svg
  pages/            Home, AddAssignment, StudyGuide, Help
  styles.css        all styles; tokens at the top
server/
  index.js          Express app: Vite (dev) or dist/ (production)
```
