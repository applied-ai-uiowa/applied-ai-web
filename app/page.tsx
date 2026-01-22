import Header from "@/components/Header";
import MeetingCard from "@/components/MeetingCard";
import { db } from "@/db";
import { meeting } from "@/db/schema";

export default async function Home() {
  const meetings = await db.select().from(meeting).limit(1);
  const nextMeeting = meetings[0] || null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-100">
              Welcome to Applied AI
            </h1>
            <p className="text-xl text-gray-400">
              University of Iowa&apos;s student organization for applied
              artificial intelligence and machine learning
            </p>
          </div>

          <div className="mb-12">
            <MeetingCard meeting={nextMeeting} />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-gray-800 p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold text-gray-100">
                Learn
              </h3>
              <p className="mb-4 text-gray-400">
                Access our curated collection of tutorials and learning
                resources.
              </p>
              <a
                href="/tutorials"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Browse Tutorials →
              </a>
            </div>

            <div className="rounded-lg bg-gray-800 p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold text-gray-100">
                Projects
              </h3>
              <p className="mb-4 text-gray-400">
                Explore projects created by our members and the community.
              </p>
              <a
                href="/projects"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                View Projects →
              </a>
            </div>

            <div className="rounded-lg bg-gray-800 p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold text-gray-100">Team</h3>
              <p className="mb-4 text-gray-400">
                Meet the executive board members leading our organization.
              </p>
              <a
                href="/board"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Meet the Team →
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
