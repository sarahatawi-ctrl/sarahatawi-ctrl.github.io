# sarahatawi-ctrl.github.io

Official personal portfolio of **Sarah Atawi**, Computer Science Graduate.
Live at **https://sarahatawi-ctrl.github.io**

Bilingual (English / Arabic) React + Vite + Tailwind site, hosted on GitHub Pages.

## Edit content
Almost all text lives in `src/lib/content.ts`, with English and Arabic side by side:
projects and case studies, experience, education, leadership and the interface copy.
Images and video are in `public/`.

To link a project's repository, set `repositoryUrl` on that project
(for example Captain Crew, which currently shows "Repository coming soon").

## Run locally
```bash
npm ci
npm run dev
```

## Deploy
```bash
npm run deploy
```
This builds the site and publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves.
`scripts/static-routes.mjs` writes a page for every `/work/<slug>` case study so direct links work.
The `main` branch holds the source code.
