import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import {
  meeting,
  tutorials,
  projects,
  boardMembers,
  episodes,
} from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import MeetingList from "./components/MeetingList";
import TutorialsList from "./components/TutorialsList";
import ProjectsList from "./components/ProjectsList";
import BoardMembersList from "./components/BoardMembersList";
import EpisodesList from "./components/EpisodesList";

export default async function AdminPage() {
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect("/");
  }

  // Fetch data
  const meetingsList = await db
    .select()
    .from(meeting)
    .orderBy(desc(meeting.datetime));
  const tutorialsList = await db
    .select()
    .from(tutorials)
    .orderBy(asc(tutorials.sortOrder));
  const projectsList = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder));
  const membersList = await db
    .select()
    .from(boardMembers)
    .orderBy(asc(boardMembers.sortOrder));
  const episodesList = await db
    .select()
    .from(episodes)
    .orderBy(asc(episodes.sortOrder));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
      <header className="border-b border-yellow-500/20 bg-black/80 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-yellow-400">
              Admin Dashboard
            </h1>
            <Link
              href="/"
              className="text-sm font-medium text-yellow-300 hover:text-yellow-200"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Meeting Section */}
          <section className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
            <h2 className="mb-6 text-2xl font-bold text-yellow-300">
              Meetings
            </h2>
            <MeetingList meetings={meetingsList} />
          </section>

          {/* Tutorials Section */}
          <section className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
            <h2 className="mb-6 text-2xl font-bold text-yellow-300">
              Tutorials
            </h2>
            <TutorialsList tutorials={tutorialsList} />
          </section>

          {/* Projects Section */}
          <section className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
            <h2 className="mb-6 text-2xl font-bold text-yellow-300">
              Projects
            </h2>
            <ProjectsList projects={projectsList} />
          </section>
          {/* News Section */}
<section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI News</h2>
    
      href="/admin/news"
      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
    >
      Manage News &gt;
    </a>
  </div>
  <p className="mt-2 text-gray-600 dark:text-gray-400">
    Add, remove, and toggle visibility for AI news articles.
  </p>
</section>

          {/* Podcast Episodes Section */}
          <section className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
            <h2 className="mb-6 text-2xl font-bold text-yellow-300">
              Podcast Episodes
            </h2>
            <EpisodesList episodes={episodesList} />
          </section>

          {/* Board Members Section */}
          <section className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
            <h2 className="mb-6 text-2xl font-bold text-yellow-300">
              Board Members
            </h2>
            <BoardMembersList members={membersList} />
          </section>
        </div>
      </main>
    </div>
  );
}
