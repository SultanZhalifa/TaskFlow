# Contributing

## Setup

```bash
git clone https://github.com/SultanZhalifa/taskflow.git
cd taskflow
npm install
```

## Branch naming

| Prefix | Use |
|---|---|
| `feature/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation changes |

Examples: `feature/due-dates`, `fix/drag-drop-reorder`, `docs/update-readme`

## Commit messages

Write in the imperative, present tense. Describe what the commit does, not what you did:

```
Add real-time search with text highlighting
Fix task counter not updating after delete
Update README with installation instructions
```

Avoid: `fixed stuff`, `update`, `wip`, `changes`.

## Before opening a PR

1. Open `index.html` in a browser and test the changed functionality
2. Verify existing features still work: add, edit, delete, filter, search, drag-and-drop
3. Test on a mobile viewport if the change touches layout or UI
4. Run `npm run lint` and resolve any reported issues
5. Run `npm run format:check` — the CI pipeline checks this

## Code style

- **HTML**: semantic elements, 4-space indent
- **CSS**: use CSS custom properties from `:root`, BEM-like class names
- **JavaScript**: `const`/`let` only (no `var`), descriptive function names, JSDoc for public functions
