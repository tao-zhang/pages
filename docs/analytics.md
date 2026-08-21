# Analytics & Search Console

Status: **wired up, inert until GA4/GSC credentials + a live deployment
exist**. This mirrors the pattern in `monitoring/README.md` — everything
below is ready to activate the moment MAR-2 ships a production URL and the
CEO provides the two IDs.

## What's already in place

- `components/Analytics.tsx` — loads `gtag.js` and configures GA4, gated on
  `NEXT_PUBLIC_GA_ID` being set (no-ops otherwise, so the build never breaks
  for lack of a property).
- `components/AnalyticsPageview.tsx` — fires a `page_view` event on every
  route change. This part matters specifically because the site is a Next.js
  App Router app: `<Link>` navigations don't reload the page, so gtag's
  default "one page_view on load" behavior would silently miss every
  in-app navigation (blog index → post, post → post, etc.). The initial
  `gtag('config', ...)` call has `send_page_view: false` set for this reason
  — `AnalyticsPageview` covers the first load too, so there's no gap and no
  double-count.
- `app/layout.tsx` — Search Console HTML-tag verification via Next's
  `metadata.verification.google`, gated on `NEXT_PUBLIC_GSC_VERIFICATION`.
- `app/sitemap.ts` / `app/robots.ts` — generated from real content, needed
  for GSC to crawl/index anything once verified.

## What's needed from the CEO (flagging, not blocking the code)

1. **A GA4 property** (analytics.google.com → Admin → Create property).
   Copy the Measurement ID (`G-XXXXXXXXXX`) into `NEXT_PUBLIC_GA_ID` as a
   production env var on whichever host MAR-2 deploys to.
2. **A Google Search Console property** for the production domain, once
   that domain exists (MAR-2's open item). GSC → Add property → URL prefix
   → HTML tag method → copy the `content="..."` value into
   `NEXT_PUBLIC_GSC_VERIFICATION`.

No new paid tooling — both are free Google accounts tied to a Google
Workspace/Gmail login. If we don't have a shared company Google account
yet, that's the actual prerequisite to flag.

## Confirming pageview events fire

Can't be done against a real property yet (none exists), but the mechanism
itself is verified locally:

```bash
npm install
NEXT_PUBLIC_GA_ID=G-TESTID0001 npm run dev
```

Then in a browser at `localhost:3000`, open DevTools → Network, filter on
`collect`, and click around the site (home → blog → a post). Each
navigation should produce a `POST` to
`https://www.google-analytics.com/g/collect` with `en=page_view` and a
`dp`/`dl` matching the new path — confirming `AnalyticsPageview` fires on
every route change, not just hard loads. (The request itself will 404/be
ignored by Google since `G-TESTID0001` isn't a real property — that's
expected. It confirms the client-side firing logic, not receipt.)

Once a real `NEXT_PUBLIC_GA_ID` is set in production, the equivalent
production check is **GA4 → Reports → Realtime**: load the live site in
another tab and confirm a user + pageview shows up within ~30 seconds.

## Verifying the site in Search Console (once deployed)

1. Set `NEXT_PUBLIC_GSC_VERIFICATION` (see above) and redeploy.
2. In Search Console, click "Verify" on the HTML tag method — it checks for
   the meta tag `app/layout.tsx` already renders via `metadata.verification`.
3. Search Console → Sitemaps → submit `https://<domain>/sitemap.xml`.
4. Search Console → URL Inspection → paste the homepage URL → confirm
   "URL is on Google" (may take hours/days for a brand-new domain — that's
   normal, not a misconfiguration).

## Pulling a weekly traffic snapshot

Manual (no tooling needed), every Monday:

1. **GA4** → Reports → Life cycle → Acquisition → Traffic acquisition.
   Set the date range to the last 7 days. Note total Users and Sessions,
   and which channel (Organic Search vs. Direct vs. Referral) they came
   from. Export → CSV/Sheets if it needs to go in a report.
2. **Search Console** → Performance → Search results. Set date range to
   last 7 days. Note total Clicks, Impressions, and average position —
   this is the leading indicator for the 10k-organic-visitors goal, since
   it shows ranking movement before traffic catches up.
3. Log both numbers somewhere durable (a recurring doc, or a comment on
   the relevant tracking issue) so week-over-week movement toward 10,000
   monthly visitors is visible over time.

Once there's a real cadence and a GA4 property, this can be automated with
the [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
(a service-account key + a small script) instead of a manual pull — noted
here as a future upgrade, not built now since there's nothing to query yet.
