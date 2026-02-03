import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-yellow-500/10 bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-gray-400 sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Applied AI</span>
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
