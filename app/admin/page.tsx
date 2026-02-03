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
import { asc } from "drizzle-orm";
import MeetingForm from "./components/MeetingForm";
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
  const meetings = await db.select().from(meeting).limit(1);
  const currentMeeting = meetings[0] || null;
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
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-100">
              Admin Dashboard
            </h1>
            <Link
              href="/"
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Meeting Section */}
          <section className="rounded-lg bg-gray-800 p-6 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">
              Meeting Information
            </h2>
            <MeetingForm initialData={currentMeeting} />
          </section>

          {/* Tutorials Section */}
          <section className="rounded-lg bg-gray-800 p-6 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">Tutorials</h2>
            <TutorialsList tutorials={tutorialsList} />
          </section>

          {/* Projects Section */}
          <section className="rounded-lg bg-gray-800 p-6 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">Projects</h2>
            <ProjectsList projects={projectsList} />
          </section>

          {/* Podcast Episodes Section */}
          <section className="rounded-lg bg-gray-800 p-6 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">
              Podcast Episodes
            </h2>
            <EpisodesList episodes={episodesList} />
          </section>

          {/* Board Members Section */}
          <section className="rounded-lg bg-gray-800 p-6 shadow">
            <h2 className="mb-6 text-2xl font-bold text-gray-100">
              Board Members
            </h2>
            <BoardMembersList members={membersList} />
          </section>
        </div>
      </main>
    </div>
  );
}
