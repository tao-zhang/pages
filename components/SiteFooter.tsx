import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-gray-500">
        © {new Date().getUTCFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
