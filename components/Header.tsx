import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-yellow-500/20 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png" // put your logo in /public and name it logo.png (or change this path)
            alt="Applied AI Logo"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <div className="leading-tight">
            <div className="text-xl font-bold tracking-tight text-yellow-400">
              Applied AI
            </div>
            <div className="text-xs text-gray-300">University of Iowa</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/tutorials"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Tutorials
          </Link>
          <Link
            href="/projects"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Projects
          </Link>
          <Link
            href="/board"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Board
          </Link>
          <a
            href="/#workshops"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Workshops
          </a>
          <a
            href="/#episodes"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Episodes
          </a>
          <a
            href="/#tools"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Tools
          </a>
          <a
            href="/#contact"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Contact
          </a>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Sign In
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/admin"
              className="hidden rounded-xl border border-yellow-500/30 bg-black/40 px-4 py-2 text-sm font-semibold text-yellow-200 transition hover:border-yellow-400/60 hover:bg-black/60 sm:inline-flex"
            >
              Admin
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="border-t border-yellow-500/10 bg-black/70 md:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-4 gap-y-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href="/tutorials"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Tutorials
          </Link>
          <Link
            href="/projects"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Projects
          </Link>
          <Link
            href="/board"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Board
          </Link>
          <a
            href="/#workshops"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Workshops
          </a>
          <a
            href="/#episodes"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Episodes
          </a>
          <a
            href="/#tools"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Tools
          </a>
          <a
            href="/#contact"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Contact
          </a>

          <div className="ml-auto">
            <SignedOut>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-3 py-1.5 font-semibold text-black transition hover:bg-yellow-300"
              >
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
