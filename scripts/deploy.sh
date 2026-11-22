#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch, which GitHub Pages serves.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
touch dist/.nojekyll
remote="$(git remote get-url origin)"
src="$(git rev-parse --short HEAD)"
tmp="$(mktemp -d)"
cp -R dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy ${src}"
git push -q -f "$remote" gh-pages
cd - >/dev/null
rm -rf "$tmp"
echo "Deployed ${src} to gh-pages. GitHub Pages will update in about a minute."
