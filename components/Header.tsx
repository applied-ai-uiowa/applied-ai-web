import Link from "next/link";
import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Header() {
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
            href="/episodes"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Episodes
          </Link>
          <Link
            href="/board"
            className="text-sm font-medium text-gray-200 transition hover:text-yellow-400"
          >
            Board
          </Link>
        </nav>

        {/* Auth */}
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
          <Link
            href="/episodes"
            className="text-gray-200 transition hover:text-yellow-400"
          >
            Episodes
          </Link>

        </div>
      </div>
    </header>
  );
}
