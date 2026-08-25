# Expense Tracker

Lightweight personal expense tracker built with Vite and React.

## Overview

This project is a client-side single-page application for tracking transactions, budgets, goals, and basic analytics. It ships with example seed data and local storage persistence.

## Features

- Dashboard with summary stats
- Transactions list with add/edit/delete
- Budgets and goals pages
- CSV export / import (if implemented)
- Responsive UI

## Tech stack

- React + JSX
- Vite (development + build)
- CSS-in-JS for styling (project `styles/`)

## Quickstart (local)

1. Clone the repo (you already did):

```bash
git clone https://github.com/saurabhahir1003/expense_tracker.git
cd expense_tracker
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Run the dev server:

```bash
npm run dev
# or
pnpm dev
```

4. Open http://localhost:5173 in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Environment

If the project uses runtime environment variables, create a `.env` or `.env.local` in the project root. Do not commit secrets.

## Project structure (important files)

- `src/` — application source
- `src/pages/` — page components (Dashboard, Transactions, Admin, etc.)
- `src/components/` — shared UI components
- `data/seedData.js` — sample data used by the app
- `styles/` — global and component styles
- `package.json` — scripts and dependencies

## Adding a README section or screenshots

If you want, I can add screenshots, badges (CI, license), or a detailed usage guide for specific features.

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes and open a PR

## License

This repository does not include a license file by default. If you want the MIT license, tell me and I'll add one.

---

Created for the local Expense Tracker project. Open [README.md](README.md) for this file in the project root.
