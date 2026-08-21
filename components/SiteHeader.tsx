import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-black">
          Blog
        </Link>
      </nav>
    </header>
  );
}
