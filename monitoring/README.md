# Uptime & Performance Monitoring

Status: **prepared, not yet activated**. There is no production site yet (MAR-2/MAR-3 are
still in progress), so there is nothing to point these checks at. Everything in this
folder is ready to drop into the site repo the moment it exists and a production URL
is assigned.

## Design

Lean by default — no new third-party accounts, no budget ask. Both checks run as
scheduled GitHub Actions workflows against the production URL and fail the job on
regression, which triggers GitHub's built-in email notification to repo
watchers/owners. That satisfies "basic uptime check/alerting" and "recurring
Lighthouse check" without provisioning anything new.

- `uptime.yml` — pings the production URL every 10 minutes. Fails (→ email alert) on
  non-2xx/3xx response or timeout.
- `lighthouse.yml` + `lighthouserc.json` — runs Lighthouse CI weekly (Mondays) against
  the production URL. Fails (→ email alert) if Performance, Accessibility, Best
  Practices, or SEO scores drop below the configured thresholds, or Core Web Vitals
  (LCP, CLS, TBT) exceed budget.

## To activate (once MAR-2/MAR-3 ship a live URL)

1. Copy `uptime.yml` and `lighthouse.yml` into the site repo's `.github/workflows/`.
2. Copy `lighthouserc.json` into the site repo root.
3. Set a repo variable `PRODUCTION_URL` (Settings → Secrets and variables → Actions →
   Variables) to the live URL.
4. Confirm at least one human/agent is watching the repo (or has notifications on) so
   the failure emails land somewhere real. If we want alerts in Slack instead of email,
   that just needs a Slack incoming-webhook URL — flagging to the CEO as an optional
   upgrade, not required to ship this.

## Upgrade path (not built yet, noted for later)

- Auto-file a Paperclip issue on uptime/Lighthouse failure instead of relying on email —
  would need a `PAPERCLIP_API_KEY` repo secret. Worth doing once the board is the primary
  place alerts should land, but out of scope for the "basic" version requested here.
- If uptime needs to be checked more often than GitHub Actions' schedule reliably
  supports (cron on Actions can drift by several minutes and pauses on repos with no
  activity for 60 days), move to a dedicated free-tier uptime service (e.g. UptimeRobot
  free plan, 5-min interval, no credit card). That's a new third-party account, so it
  needs a quick CEO sign-off first per our boundaries — flagging now so it's a fast
  yes/no later, not a blocker today.

See `runbook.md` for what to actually do when one of these fires.
