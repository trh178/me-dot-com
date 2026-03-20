# me-dot-com

Personal site hosted on GitHub Pages. Single-page layout with posts, projects, and ideas sourced from markdown files.

## How it works

Content lives in three directories as plain markdown files:

```
posts/       # blog-style writing
ideas/       # shorter, exploratory thoughts
projects/    # project descriptions
```

A set of Node.js build scripts read those files and generate JSON metadata (`posts.json`, `ideas.json`, `projects.json`) that the frontend fetches at runtime. The main page shows the 3 most recent posts and ideas; the archive page lists everything.

## Writing content

Each markdown file needs a frontmatter block at the top:

**Posts and Ideas:**
```markdown
---
title: My Title
date: 2026-03-20
description: One-line summary (ideas only, optional for posts)
---

Content goes here...
```

**Projects:**
```markdown
---
title: Project Name
description: What it does
tech: [TypeScript, Node.js, PostgreSQL]
repo: https://github.com/you/repo
---
```

The `date` field controls sort order — newest first. Ideas without a date sort to the bottom.

## Deploying

Push to `main`. The GitHub Actions workflow at `.github/workflows/deploy.yml` automatically runs the build scripts and deploys to GitHub Pages. No manual build step needed.

**Required one-time setup:** In the GitHub repo, go to Settings → Pages → Build and deployment → Source and select **GitHub Actions**.

## Testing locally

**1. Rebuild the JSON** (run this after adding or editing any markdown file):
```bash
npm run build
```

**2. Start the local server:**
```bash
npx serve .
```

**3. Open** `http://localhost:3000`

The `serve.json` in the repo root configures the local server to preserve query strings on `.html` files, which is required for `view.html?file=...` links to work correctly.
