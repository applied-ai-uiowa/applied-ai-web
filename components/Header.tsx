"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/meetings", label: "Meetings" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/projects", label: "Projects" },
  { href: "/episodes", label: "Episodes" },
  { href: "/board", label: "Board" },
];

export default function Header() {
  // Store the pathname at which the menu was opened so it auto-closes on route change.
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const pathname = usePathname();

  const menuOpen = menuOpenPath === pathname;

  function navLinkClass(href: string, base: string) {
    return pathname === href
      ? `${base} text-yellow-400 border-yellow-400`
      : `${base} text-gray-200 hover:text-yellow-400 border-transparent hover:border-yellow-400/40`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-yellow-500/20 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Applied AI Logo"
            width={40}
            height={40}
            priority
          />
          <div className="leading-tight">
            <div className="text-xl font-bold tracking-tight text-yellow-400">
              Applied AI
            </div>
            <div className="text-xs text-gray-300">University of Iowa</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={navLinkClass(
                href,
                "border-b-2 pb-0.5 text-sm font-medium transition"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth + Hamburger */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() =>
              setMenuOpenPath((p) => (p === pathname ? null : pathname))
            }
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-200 transition hover:bg-yellow-400/10 hover:text-yellow-400 md:hidden"
          >
            {/* Hamburger icon */}
            <svg
              className={`absolute h-5 w-5 transition-all duration-200 ${menuOpen ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {/* X icon */}
            <svg
              className={`absolute h-5 w-5 transition-all duration-200 ${menuOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Panel */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-yellow-500/10 bg-black/90 backdrop-blur transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6 lg:px-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setMenuOpenPath(null)}
              className={navLinkClass(
                href,
                "block border-b border-b-2 border-yellow-500/10 py-3 text-base font-medium transition last:border-0"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
