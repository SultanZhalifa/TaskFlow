# TaskFlow

A client-side task manager built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Overview

TaskFlow is a browser-based task manager focused on simplicity and usability. Tasks persist across sessions using `localStorage` — no backend, no account required.

The goal was to build something genuinely useful using only the web platform: no React, no npm packages, no bundler.

---

## Features

**Task management**
- Add, complete, edit, and delete tasks
- Priority levels: low, medium, high
- Duplicate detection on task creation

**Organization**
- Filter by All / Active / Completed
- Real-time search with text highlighting
- Drag and drop reordering

**Data**
- Persistent storage via `localStorage`
- Export tasks to JSON
- Import tasks from a JSON backup

**UI**
- Responsive layout for mobile and desktop
- Dark mode via `prefers-color-scheme`
- Toast notifications for user feedback
- Keyboard shortcuts

---

## Tech stack

| | |
|---|---|
| HTML5 | Structure and accessibility |
| CSS3 | Styling, animations, CSS custom properties |
| JavaScript ES6+ | App logic, DOM, Drag & Drop API |
| localStorage API | Client-side persistence |
| FileReader API | JSON import/export |
| Google Fonts (Inter) | Typography |

---

## Getting started

Clone the repository and open `index.html` in any modern browser:

```bash
git clone https://github.com/SultanZhalifa/taskflow.git
cd taskflow
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

No install step is needed to run the app. If you want a local server with live reload, use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code, or:

```bash
npx serve .
```

### Linting and formatting

The project includes ESLint and Prettier. To use them:

```bash
npm install
npm run lint          # check for issues
npm run lint:fix      # auto-fix where possible
npm run format        # format all files
npm run format:check  # check formatting without writing
```

---

## Folder structure

```
taskflow/
├── index.html              # App markup
├── style.css               # Styles, animations, CSS variables
├── script.js               # All application logic
├── package.json            # Dev tooling (ESLint, Prettier)
├── .eslintrc.json          # ESLint config
├── .prettierrc             # Prettier config
├── .editorconfig           # Editor settings
├── LICENSE
└── .github/
    └── workflows/
        └── ci.yml          # Lint checks on push/PR
```

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Add task / save edit |
| `Escape` | Cancel edit / clear search |
| `Ctrl + K` | Focus search bar |
| `Double-click` | Edit task inline |

---

## Screenshots

*Add screenshots or a demo GIF here.*

---

## Potential improvements

A few things that would genuinely make this better:

- **Due dates** — date picker per task with overdue indicators
- **Task notes** — expandable description field per task
- **Labels/categories** — group tasks by project or context
- **Undo/redo** — history stack for task mutations
- **PWA support** — service worker for offline use and installability
- **Unit tests** — Vitest for core logic (add, filter, reorder)
- **Cloud sync** — optional backend with user accounts

---

## License

[MIT](LICENSE)
