# Publishing a post

For the content role — no code knowledge needed beyond git basics. Four
posts/week is only sustainable if this is low-friction, so this is
deliberately short.

## 1. Start a post

```bash
git checkout -b post/my-new-post
npm install   # first time only
npm run new-post -- "My New Post Title"
```

This creates `content/posts/my-new-post-title.mdx` with frontmatter
pre-filled and `draft: true`. The filename becomes the URL
(`/blog/my-new-post-title`).

## 2. Write it

Fill in the body below the frontmatter. Standard Markdown, plus tables and
strikethrough. Preview locally:

```bash
npm run dev
```

Draft posts (`draft: true`) render at their URL in `npm run dev` even
though they're excluded from the live site — check it renders how you
expect before opening a PR.

Required frontmatter fields: `title`, `date` (`YYYY-MM-DD`), `description`
(used for the meta description, social cards, and RSS), `tags`. See
`content/posts/welcome-to-the-blog.mdx` for a full example with comments.

## 3. Open a PR — this is the review step

```bash
git add content/posts/my-new-post-title.mdx
git commit -m "Add post: My New Post Title"
git push -u origin post/my-new-post
```

Open a PR into `main`. CI runs automatically (build + lint) and the PR
template has a checklist. **Before requesting review, flip `draft: true`
to `draft: false`** (or delete the line) — that's what actually makes it
go live, not the merge itself.

A reviewer reads the rendered content (not just the diff — pull the branch
or trust the CI build) and approves.

## 4. Merge

Merging to `main` triggers an automatic deploy (`.github/workflows/deploy.yml`).
No manual publish step. Once the build finishes (a few minutes), the post is:

- live at `/blog/<slug>`
- listed on `/blog` (newest first, automatic — no index to hand-edit)
- in `/sitemap.xml` (so it can be crawled)
- in `/feed.xml` (RSS, for subscribers/aggregators)

If any of those don't reflect a merged post, check the "Deploy" workflow run
in the repo's Actions tab before assuming the content is wrong.

## Fixing or unpublishing a live post

Same flow: branch, edit the `.mdx` file (or set `draft: true` to pull it
down without deleting it), PR, merge. There's no separate CMS or database —
the file in `content/posts/` on `main` *is* the source of truth.

## One-time setup this depends on (engineering, not content — tracked separately)

- A GitHub remote for this repo, and GitHub Pages enabled with
  Source = "GitHub Actions" (Settings > Pages) — until then, `npm run build`
  works locally but merges don't reach a public URL.
- `NEXT_PUBLIC_SITE_URL` set to the real domain once one exists — until
  then, canonical URLs/sitemap/RSS use `https://example.com` as a placeholder.
