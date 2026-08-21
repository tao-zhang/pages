# Incident Runbook: Uptime & Performance Alerts

## If the Uptime Check fires (site is down or erroring)

The `Uptime Check` GitHub Action failed, meaning the production URL returned a
non-2xx/3xx status or timed out.

1. **Confirm it's real.** Load the production URL yourself in a browser and with
   `curl -I <url>`. Rule out a one-off blip (the workflow retries every 10 min, so a
   single failure may already have self-resolved).
2. **Check the hosting provider's status page** for an ongoing incident on their end.
   If it's a provider outage, there's nothing to fix on our side — note it and monitor.
3. **Check recent deploys.** If a deploy went out shortly before the failure, that's
   the prime suspect:
   - Look at the last commit/PR merged to the site repo's main branch.
   - Check the deploy platform's build/deploy logs for errors.
   - If the last deploy is the cause, roll it back (redeploy the previous successful
     build) first, investigate the root cause after — restoring service comes before
     root-causing.
4. **Check DNS/domain.** If the domain registrar or DNS provider had a recent change,
   confirm records still point where they should.
5. **Once resolved**, comment on the relevant issue (or file one if none exists) with:
   what broke, how long it was down, what fixed it, and one line on how to prevent a
   repeat if applicable.
6. **If you can't identify the cause within ~30 minutes**, escalate to the CEO with
   what you've ruled out — don't sit on an active outage.

## If the Lighthouse CI check fires (performance/SEO/a11y regression)

The weekly `Lighthouse CI` run dropped below a threshold in `lighthouserc.json`
(Performance/Accessibility/Best Practices/SEO score, or a Core Web Vital budget:
LCP, CLS, TBT).

1. **Read the failing assertion** in the workflow's job output — it names the exact
   metric and category that regressed, and links to the full report (uploaded to
   temporary public storage by the action).
2. **Correlate with recent changes.** Common causes:
   - New/unoptimized images in a recent blog post (LCP regression) → compress, add
     explicit width/height, use a modern format.
   - New third-party script/embed (TBT, Performance regression) → defer/async load it
     or reconsider whether it's needed.
   - Layout-shifting content (ads, late-loading fonts/embeds) → CLS regression → set
     explicit dimensions, preload key fonts.
   - Missing meta description/title/alt text on a new page → SEO/Accessibility score
     drop → fix the page template or the specific post's frontmatter.
3. **Reproduce locally** with `npx lighthouse <url> --view` if you need more detail
   than the CI report gives you.
4. **Fix and confirm** by re-running the workflow manually (`workflow_dispatch`) against
   the production URL before considering it resolved.
5. **If the regression is content-driven** (e.g., a specific post's images), loop in
   whoever owns publishing so future posts don't reintroduce it — this is a process
   gap, not just a one-off fix.

## General principle

Uptime alerts are urgent — restore service first, investigate after. Lighthouse
alerts are not urgent (this week's report doesn't need a fix in the next hour) but
should not be allowed to accumulate — fix within the same week they're detected so
regressions don't compound.
