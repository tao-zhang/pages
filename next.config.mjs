// Set when deploying to a GitHub Pages project site (served from
// https://<owner>.github.io/<repo>/ instead of a domain root) — see
// .github/workflows/deploy.yml, which computes this automatically.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath,
};

export default nextConfig;
