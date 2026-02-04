import Link from "next/link";
import {
  GroupMeIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  TwitterIcon,
} from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-yellow-500/10 bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-gray-400 sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Applied AI</span>

        <div className="flex items-center gap-4">
          {/* GroupMe */}
          <a
            href="https://groupme.com/join_group/106294198/W4gZutv4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition hover:text-yellow-200"
            aria-label="GroupMe"
          >
            <GroupMeIcon className="h-5 w-5" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/applied-a-i/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition hover:text-yellow-200"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/uiowa.appliedai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition hover:text-yellow-200"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com/@uiowa.appliedai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition hover:text-yellow-200"
            aria-label="TikTok"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>

          {/* Twitter/X */}
          <a
            href="https://x.com/uiowa_appliedai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition hover:text-yellow-200"
            aria-label="X (Twitter)"
          >
            <TwitterIcon className="h-5 w-5" />
          </a>
        </div>

        <Link
          href="/admin"
          className="text-yellow-200/70 transition hover:text-yellow-200"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
