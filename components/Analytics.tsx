import Script from "next/script";
import { Suspense } from "react";
import { siteConfig } from "@/lib/site";
import { AnalyticsPageview } from "@/components/AnalyticsPageview";

/**
 * No-ops until NEXT_PUBLIC_GA_ID is set. Wired up ahead of time so
 * flipping on GA4 is a one-line env var change, not a deploy.
 *
 * send_page_view is disabled on the initial `config` call because
 * AnalyticsPageview fires the page_view for every route (including the
 * first one) — otherwise the landing page would be double-counted.
 */
export function Analytics() {
  if (!siteConfig.gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${siteConfig.gaId}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <AnalyticsPageview gaId={siteConfig.gaId} />
      </Suspense>
    </>
  );
}
