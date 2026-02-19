import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { meeting } from "@/db/schema";
import { lt, desc } from "drizzle-orm";

export default async function MeetingsPage() {
  const now = new Date();
  const pastMeetings = await db
    .select()
    .from(meeting)
    .where(lt(meeting.datetime, now))
    .orderBy(desc(meeting.datetime));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-yellow-400">
            Past Meetings
          </h1>

          {pastMeetings.length === 0 ? (
            <p className="text-gray-400">No past meetings yet.</p>
          ) : (
            <div className="space-y-4">
              {pastMeetings.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30"
                >
                  <h2 className="text-xl font-semibold text-yellow-300">
                    {m.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-300">
                    {new Date(m.datetime).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    · {m.location}
                  </p>
                  {m.details && (
                    <p className="mt-2 text-sm text-gray-300">{m.details}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
