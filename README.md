# Otávio Miranda — Blog & Personal Site

Source code for [otaviomiranda.com.br](https://www.otaviomiranda.com.br).

This is an open lab. Read the code, open issues, submit posts.

---

## Stack

- **[Astro](https://astro.build)** — Static Site Generation
- **GitHub Pages** — hosting
- **GitHub Actions** — deploy (manual trigger)
- **Shiki** — syntax highlighting
- **Vite** — asset optimization

---

## Running locally

```bash
git clone https://github.com/luizomf/otaviomiranda.com.br.git
cd otaviomiranda.com.br
npm install
npm run dev
```

Visit `http://localhost:4321`.

### Common commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview the build locally
npm run lint       # Astro check + Prettier
```

---

## Writing a post

### Quick way

```bash
npm run post "Your post title"
```

Creates the folder, images directory, and `text.md` with frontmatter ready to fill.

### Manual way

1. Create `src/content/posts/YEAR/your-post-slug/text.md`
2. Add images to `src/content/posts/YEAR/your-post-slug/images/`

### Frontmatter (required)

```yaml
---
title: 'Your post title'
description: 'One or two lines summarizing the post.'
author: 'Your name'
date: 2026-01-01
---
```

---

## Contributing a post

Want to write a guest post? Open an issue using the **Content** template and
describe what you want to cover. If it fits the site's editorial line, we'll
work from there.

### Editorial line

- Technical content aimed at developers
- Clear, no fluff, no ads, no popups
- Code examples when relevant
- Your own words — no AI-generated filler

### Submitting

1. Fork the repo
2. Create a branch: `git checkout -b post/your-post-slug`
3. Write your post following the structure above
4. Open a PR using the PR template — fill in all fields
5. Reference the issue: `closes #N`

---

## Contributing code

Same flow as above but use the appropriate issue template (Bug, Feature, or
Refactor) before starting.

---

## Deploy

Triggered manually via GitHub Actions. Go to **Actions → Deploy to GitHub
Pages → Run workflow**.

---

## Editor

There's a browser-based Markdown editor at `/editor/` — Monaco + live preview
+ File System Access API. Useful for writing posts directly in the browser.

---

_"Done is better than perfect."_
