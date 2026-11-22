// GitHub Pages has no SPA rewrites. After `vite build`, write a real HTML file for every
// case-study route so /work/<slug> loads directly with HTTP 200, plus a 404.html fallback.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist');
const content = readFileSync(path.resolve(import.meta.dirname, '..', 'src', 'lib', 'content.ts'), 'utf8');
const slugs = [...content.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1]);
if (slugs.length === 0) throw new Error('No project slugs found in content.ts');

const index = path.join(dist, 'index.html');
mkdirSync(path.join(dist, 'work'), { recursive: true });
for (const slug of slugs) {
  copyFileSync(index, path.join(dist, 'work', `${slug}.html`)); // served at /work/<slug>
  mkdirSync(path.join(dist, 'work', slug), { recursive: true });
  copyFileSync(index, path.join(dist, 'work', slug, 'index.html')); // served at /work/<slug>/
}
copyFileSync(index, path.join(dist, '404.html'));
console.log(`static routes: ${slugs.map((s) => `/work/${s}`).join(', ')} + 404.html`);
