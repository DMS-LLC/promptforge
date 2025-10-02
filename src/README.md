# PromptForge dropdown builder

This workspace contains a self-contained front-end that lets you author prompt dropdown collections, lock or randomize option selections, and preview the assembled prompt in real time.

## Quick start: open it instantly

You do **not** need to install dependencies or run a dev server to try PromptForge. The production build is checked into version control under [`dist/`](dist/).

1. Download or clone this repository.
2. Open `src/dist/index.html` in your browser (double-clicking the file works on Windows and macOS).
3. Start creating dropdowns immediately—the UI persists your edits to `localStorage`, so refreshing the page keeps your work.

> Tip: bookmark the local file URL once it is open so you can return to the tool with a single click.

## Developer workflow

If you want to work on the source or run the automated tests, install dependencies and use the provided npm scripts:

```bash
cd src
npm install
npm run dev        # Start Vite in development mode
npm run build      # Type-check and produce the production build in dist/
npm run lint       # Run ESLint
npm run test -- --run  # Execute the Vitest suite once
```

Running `npm run build` regenerates the contents of `dist/`. Commit the updated build whenever you make UI changes so non-developers can keep using the click-to-open experience.

## Folder structure

- `src/src/` – React components, hooks, styles, and tests.
- `src/dist/` – Production-ready assets that can be opened directly in a browser.
- `src/public/` – Static assets copied into the build (e.g., icons).

## Feedback loop

Issues and feature ideas are always welcome. If you spot something that could make the quick-start flow even easier, feel free to open a ticket or drop a note in your review.
