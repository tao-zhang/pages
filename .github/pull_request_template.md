<!-- If this PR adds or edits a post, use this checklist. Delete it otherwise. -->

## Post checklist

- [ ] Frontmatter has `title`, `date`, `description`, and `tags`
- [ ] `date` is the intended publish date (drives sort order, sitemap, and RSS)
- [ ] `draft` is removed or set to `false` — otherwise this will **not** go live on merge
- [ ] Read it locally (`npm run dev`) — links resolve, headings/formatting look right
- [ ] CI is green

Merging to `main` redeploys the site automatically. Approving this PR is the
last check before the post is live — see `docs/publishing.md` for the full flow.
