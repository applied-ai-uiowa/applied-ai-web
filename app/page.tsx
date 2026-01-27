import Header from "@/components/Header";
import MeetingCard from "@/components/MeetingCard";
import { db } from "@/db";
import { meeting } from "@/db/schema";
import Link from "next/link";

export default async function Home() {
  const meetings = await db.select().from(meeting).limit(1);
  const nextMeeting = meetings[0] || null;

  const features = [
    {
      title: "Tutorials",
      description:
        "Curated learning paths and resources to build real-world AI skills.",
      href: "/tutorials",
      cta: "Browse tutorials",
    },
    {
      title: "Projects",
      description:
        "Explore member projects, demos, and repositories — and contribute to new builds.",
      href: "/projects",
      cta: "View projects",
    },
    {
      title: "Executive Board",
      description:
        "Meet the team behind Applied AI and learn how to get involved.",
      href: "/board",
      cta: "Meet the board",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-10">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-yellow-400 sm:text-5xl">
              Welcome to Applied AI
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-gray-200">
              University of Iowa&apos;s student organization for applied
              artificial intelligence and machine learning.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tutorials"
                className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
              >
                Explore tutorials
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl border border-yellow-500/30 bg-black/40 px-5 py-3 text-sm font-semibold text-yellow-200 transition hover:border-yellow-400/60 hover:bg-black/60"
              >
                See projects
              </Link>
            </div>
          </div>

          {/* Meeting Card */}
          <div className="mb-12">
            <MeetingCard meeting={nextMeeting} />
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
              >
                <h3 className="text-lg font-semibold text-yellow-400">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-200">
                  {f.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-yellow-200 transition group-hover:text-yellow-100">
                  {f.cta}
                  <span aria-hidden className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer note (optional) */}
          <div className="mt-12 text-sm text-gray-400">
            Want to collaborate or sponsor a workshop? Reach out via the contact
            links in the header.
          </div>
        </div>
      </main>
    </>
  );
}
