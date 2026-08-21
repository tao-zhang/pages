export const siteConfig = {
  name: "The Blog",
  description:
    "Insights and guides published by our team — updated multiple times a week.",
  // Replace once a real domain is purchased/pointed. Falls back to a
  // placeholder so metadata/sitemap generation never breaks the build.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
};
