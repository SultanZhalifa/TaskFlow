# TaskFlow — Smart Task Manager

> A modern, elegant task management web application built with **vanilla HTML, CSS, and JavaScript**.  
> Designed with a premium black & white aesthetic inspired by [antigravity.google](https://antigravity.google).

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Getting Started](#-getting-started)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Team Members](#-team-members)
- [Git Workflow](#-git-workflow)
- [Contributing](#-contributing)
- [License](#-license)

---

## Features

### Core Features
| Feature | Description |
|---|---|
| **Add Tasks** | Quickly add new tasks with an intuitive input form |
| **Complete Tasks** | Toggle tasks as done with a satisfying checkbox animation |
| **Edit Tasks** | Double-click or press edit button to modify task text inline |
| **Delete Tasks** | Remove tasks with smooth slide-out animation |
| **Duplicate Detection** | Prevents adding the same task twice |

### Search & Filter
| Feature | Description |
|---|---|
| **Real-time Search** | Instant search with text highlighting |
| **Filter Tasks** | View All, Active, or Completed tasks with live count badges |
| **Task Counter** | Live count of remaining active tasks |
| **Clear Completed** | Bulk remove all finished tasks |

### Advanced Features
| Feature | Description |
|---|---|
| **Task Priority** | Assign Low, Medium, or High priority with color-coded badges |
| **Drag & Drop Sorting** | Reorder tasks by dragging with visual handle |
| **Export to JSON** | Download all tasks as a `.json` backup file |
| **Import from JSON** | Restore tasks from a previously exported `.json` file |
| **Animated Placeholder** | Typewriter effect on the input field with rotating suggestions |

### UX & Design
| Feature | Description |
|---|---|
| **Premium B&W Theme** | Minimalist black & white design |
| **SVG Icons** | All icons are crisp, scalable SVGs (no emoji dependencies) |
| **Toast Notifications** | Dark pill notifications for every action |
| **Keyboard Shortcuts** | `Enter` to add, `Escape` to cancel, `Ctrl+K` to search |
| **Local Storage** | Data persists across browser sessions |
| **Responsive Design** | Works beautifully on desktop, tablet, and mobile |
| **Smooth Animations** | Micro-animations for task add, delete, and transitions |

---

## Demo

To run the app locally, simply open `index.html` in your browser. No server or installation required!

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server or dependencies required!

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Sultan-skibidi/TaskFlow.git
   ```

2. Navigate to the project folder:
   ```bash
   cd TaskFlow
   ```

3. Open `index.html` in your browser:
   ```bash
   # Windows
   start index.html

   # macOS
   open index.html

   # Or use Live Server extension in VS Code
   ```

---

## Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure & accessibility |
| **CSS3** | Styling, animations, responsive design, CSS variables |
| **JavaScript (ES6+)** | Application logic, DOM manipulation, Drag & Drop API |
| **localStorage API** | Client-side data persistence |
| **FileReader API** | Import/Export JSON functionality |
| **Google Fonts (Inter)** | Modern, clean typography |

> **Note:** This project uses **zero external libraries or frameworks** — everything is built from scratch with vanilla web technologies.

---

## Project Structure

```
TaskFlow/
├── index.html         # Main HTML page structure
├── style.css          # All styles, themes, and animations
├── script.js          # Application logic (CRUD, search, filter, D&D, export/import)
├── .gitignore         # Git ignore rules
├── CONTRIBUTING.md    # Contribution guidelines
├── GIT_GUIDE.md       # Step-by-step Git workflow guide (Bahasa Indonesia)
└── README.md          # Project documentation (this file)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Add a new task / Save edited task |
| `Escape` | Cancel editing / Clear search |
| `Ctrl + K` | Focus search bar |
| `Double-click` | Edit a task inline |

---

## Team Members & Task Assignments

| NIM | Name | Role | Branch |
|---|---|---|---|
| 001202400200 | Sultan Zhalifunnas Musyaffa | Project Lead & Advanced Features | `main`, `feature-super-maximal` |
| 001202400069 | Risly Maria Theresia Worung | UI/UX Design (Antigravity B&W Theme) | `feature-ui-design` |
| 001202400040 | Misha Andalusia | Core JS Logic & Drag/Drop | `feature-add-task` |
| 001202400054 | Fathir Barhouti Awlya | Task Actions & Animated Placeholder | `feature-task-actions` |

---

## Git Workflow

This project follows a **feature-branch workflow** with Pull Requests and Code Reviews:

1. **Main Branch** — Production-ready code
2. **Feature Branches** — Each feature is developed in isolation
3. **Pull Requests** — Features are reviewed and merged via PRs
4. **Code Reviews** — Team members review and approve each other's code

### Branch History

```
main
├── feature-ui-design        ← HTML structure & Antigravity B&W CSS (Risly)
├── feature-add-task         ← Add task, render DOM, Drag & Drop (Misha)
├── feature-task-actions     ← Edit, complete, delete, search, placeholder (Fathir)
└── feature-super-maximal    ← Priority, Export/Import, advanced features (Sultan)
```

> For a detailed step-by-step guide on the Git workflow (in Bahasa Indonesia), see [`GIT_GUIDE.md`](GIT_GUIDE.md).

---

## Contributing

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Branch naming conventions
- Commit message format
- Testing requirements
- Code style

---

## License

This project is created for educational purposes as part of a university assignment.

---

<p align="center">
  Built with ♥ by <b>Team TaskFlow</b>
</p>
