import Header from "@/components/Header";
import MeetingCard from "@/components/MeetingCard";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { meeting, boardMembers } from "@/db/schema";
import { asc, eq, gte } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const now = new Date();
  const [nextMeeting = null] = await db
    .select()
    .from(meeting)
    .where(gte(meeting.datetime, now))
    .orderBy(asc(meeting.datetime))
    .limit(1);

  const members = await db
    .select()
    .from(boardMembers)
    .where(eq(boardMembers.isActive, true))
    .orderBy(asc(boardMembers.sortOrder))
    .limit(6);

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
      title: "Podcast Episodes",
      description: "Short, practical episodes on AI topics you can follow along with.",
      href: "/episodes",
      cta: "Listen now",
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
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-300">
              Our mission is to empower students to explore, learn, and innovate
              by providing hands-on experiences and collaborative learning
              opportunities in the capabilities of AI.
            </p>
          </div>

          {/* Meeting Card */}
          <div className="mb-12">
            <MeetingCard meeting={nextMeeting} />
            <div className="mt-3 text-right">
              <Link
                href="/meetings"
                className="text-sm font-medium text-yellow-300 hover:text-yellow-200"
              >
                View past meetings →
              </Link>
            </div>
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
                  <span
                    aria-hidden
                    className="transition group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Contact Section with Board Members */}
          <div className="mt-16">
            <section id="contact" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-yellow-300">
                  Contact Us
                </h2>
                <p className="mt-2 text-gray-200">
                  Get in touch with the Applied AI team.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Board Members */}
                <Link
                  href="/board"
                  className="group rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
                >
                  <h3 className="mb-4 text-lg font-semibold text-yellow-200">
                    Executive Board
                  </h3>

                  {members.length === 0 ? (
                    <p className="text-gray-200">
                      Board information coming soon.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {members.map((member) => (
                        <div key={member.id} className="text-center">
                          {member.photoUrl ? (
                            <Image
                              src={member.photoUrl}
                              alt={member.name}
                              width={64}
                              height={64}
                              className="mx-auto mb-2 h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-400/10">
                              <span className="text-lg font-bold text-yellow-200">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-100">
                            {member.name}
                          </div>
                          <div className="text-xs text-yellow-200/70">
                            {member.role}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-yellow-300 transition group-hover:text-yellow-200">
                    Meet the full team
                    <span
                      aria-hidden
                      className="transition group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>

                {/* Contact Info */}
                <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
                  <h3 className="mb-4 text-lg font-semibold text-yellow-200">
                    Get in Touch
                  </h3>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-yellow-500/20 bg-black/30 p-4">
                      <div className="text-sm text-gray-300">Email</div>
                      <a
                        href="mailto:studorg-appliedai@uiowa.edu"
                        className="mt-1 block font-medium text-gray-100 hover:text-yellow-200"
                      >
                        studorg-appliedai@uiowa.edu
                      </a>
                    </div>

                    <div className="rounded-xl border border-yellow-500/20 bg-black/30 p-4">
                      <div className="text-sm text-gray-300">Location</div>
                      <div className="mt-1 font-medium text-gray-100">
                        University of Iowa
                      </div>
                      <div className="mt-1 text-sm text-gray-300">
                        Iowa City, IA
                      </div>
                    </div>

                    <p className="text-sm text-gray-300">
                      Want to collaborate, sponsor a workshop, or learn more?
                      Reach out via email and we&apos;ll get back to you.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Connect With Us Section */}
          <div className="mt-16">
            <section id="connect">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-yellow-300">
                  Connect With Us
                </h2>
                <p className="mt-2 text-gray-200">
                  Follow us on social media and stay updated.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {/* GroupMe */}
                <a
                  href="https://groupme.com/join_group/106294198/W4gZutv4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src="/icons/groupme.svg"
                      alt="GroupMe Logo"
                      height={24}
                      width={24}
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-yellow-400">
                    GroupMe
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">Join the chat</p>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/applied-a-i/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src="/icons/linkedin.svg"
                      alt="LinkedIn Logo"
                      height={28}
                      width={28}
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-yellow-400">
                    LinkedIn
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">Applied AI</p>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/uiowa.appliedai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src="/icons/instagram.svg"
                      alt="Instagram Logo"
                      height={28}
                      width={28}
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-yellow-400">
                    Instagram
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">@uiowa.appliedai</p>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@uiowa.appliedai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src="/icons/tiktok.svg"
                      alt="TikTok Logo"
                      height={24}
                      width={24}
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-yellow-400">TikTok</h3>
                  <p className="mt-1 text-xs text-gray-400">@uiowa.appliedai</p>
                </a>

                {/* Twitter/X */}
                <a
                  href="https://x.com/uiowa_appliedai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src="/icons/x.svg"
                      alt="Twitter/X Logo"
                      height={24}
                      width={24}
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-yellow-400">
                    Twitter/X
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">@uiowa_appliedai</p>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
