# Blog Platform

Static Next.js (App Router) + MDX blog. `next build` with `output: "export"`
produces plain HTML/CSS/JS in `out/` — no server, no database, deployable to
any static host.

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000. Draft posts (`draft: true`) are visible in dev
and hidden from production builds automatically.

## Publishing a post

```bash
npm run new-post -- "My Post Title"
```

This creates `content/posts/my-post-title.mdx` with the required frontmatter
pre-filled and `draft: true`. Fill in the body, flip `draft` to `false` (or
delete the line) when ready to publish, commit, and open a PR.

### Frontmatter convention

```yaml
---
title: "Post Title"
date: "2026-08-21"       # ISO date, drives sort order + sitemap
description: "One or two sentences — used for meta description and social cards."
tags: ["tag-one", "tag-two"]
author: "Optional Name"   # defaults to site name if omitted
image: "https://..."      # optional, absolute URL, used for Open Graph/Twitter
draft: true                # optional, hides the post from production builds
---
```

The filename (minus `.mdx`) is the URL slug: `content/posts/my-post.mdx` →
`/blog/my-post`. Standard Markdown plus GitHub-flavored tables/strikethrough
work in the body; React components can be dropped in if a post ever needs
one.

## Review-to-publish flow

Content lives in git, so review is a PR: open a branch, add/edit the `.mdx`
file, push, get a review, merge. CI (`.github/workflows/ci.yml`) runs lint +
build on every PR so a broken post can't merge. No CMS, no separate approval
tool — the PR *is* the review. `draft: true` is the actual publish gate
(not the merge) — see `docs/publishing.md` for the full step-by-step aimed
at the content role.

Merging to `main` also triggers `.github/workflows/deploy.yml`, which
rebuilds and republishes the site automatically — merging a non-draft post
is the only "publish" action needed.

## Technical SEO already wired up

- Per-page `<title>`, meta description, canonical URL, Open Graph/Twitter
  tags (`app/layout.tsx`, `app/blog/[slug]/page.tsx`)
- `BlogPosting` JSON-LD structured data on every post
- `sitemap.xml`, `robots.txt`, and `feed.xml` (RSS) generated at build time
  from actual content (`app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts`)
  — new posts appear in the blog index, sitemap, and feed automatically,
  nothing to hand-update
- Semantic HTML (`<article>`, `<time>`, heading hierarchy) throughout
- Static export + no client-side data fetching on the content path, for
  Core Web Vitals

## Environment variables

See `.env.example`. Everything is optional — the site builds and runs with
no env vars set. Copy to `.env.local` and fill in once available:

- `NEXT_PUBLIC_SITE_URL` — production domain, used in canonical URLs and the
  sitemap
- `NEXT_PUBLIC_GA_ID` — GA4 measurement ID; analytics script only loads once
  this is set
- `NEXT_PUBLIC_GSC_VERIFICATION` — Google Search Console verification code
- `NEXT_PUBLIC_TWITTER_HANDLE` — optional, for Twitter card attribution

## Deploying

The site is a static export (`npm run build` → `out/`), so any static host
works — Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront.

Deploy-on-publish is already wired up (`.github/workflows/deploy.yml`),
defaulted to **GitHub Pages** since it needs no new third-party account —
just a GitHub repo and Pages enabled. Pushed to
[tao-zhang/pages](https://github.com/tao-zhang/pages); site will be live at
`https://tao-zhang.github.io/pages/` once Pages is enabled (see open items
below). Swapping to Vercel/Netlify later (e.g. for per-PR preview URLs, which
would make the review step above stronger) is a small change to that one
workflow file, not a rearchitecture.

Manual preview of the exact production output:

```bash
npm run build
npx serve out
```

## Open items / needs from the CEO

- **Enable GitHub Pages** on the repo — Settings → Pages → Source:
  "GitHub Actions". That's the only manual step left to make `deploy.yml`
  start publishing on every merge to `main`; this agent has no repo-admin
  access to flip it.
- **Hosting account** (only if GitHub Pages isn't the final answer): Vercel
  is the path of least friction for Next.js and adds PR preview deploys —
  flagging as an upgrade option, not required to ship.
- **Domain**: `NEXT_PUBLIC_SITE_URL` is a placeholder (`https://example.com`)
  until a real domain exists; canonical URLs, sitemap, and RSS will carry
  that placeholder until it's set as a repo variable (see `deploy.yml`).
- **GA4 property + measurement ID** and **Search Console verification**:
  analytics/search console are wired up but inert until these are provided.

## Project structure

```
app/                  routes (App Router)
  layout.tsx          global metadata, header/footer, analytics
  page.tsx            homepage
  blog/page.tsx        blog index
  blog/[slug]/page.tsx post template
  sitemap.ts, robots.ts, feed.xml/route.ts
components/           shared UI (PostCard, MdxContent, JsonLd, Analytics, ...)
content/posts/        MDX posts — this is what the content team edits
lib/posts.ts          frontmatter parsing + post queries
lib/site.ts           site-wide config (name, URL, env-gated IDs)
scripts/new-post.mjs  `npm run new-post` scaffolder
docs/publishing.md    step-by-step for the content role
.github/workflows/    ci.yml (lint+build on PR), deploy.yml (build+publish on main)
.github/pull_request_template.md  publish checklist
```
