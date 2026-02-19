import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { meeting } from "@/db/schema";
import { lt, desc } from "drizzle-orm";
import ReactMarkdown from "react-markdown";

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
                  className="overflow-hidden rounded-2xl border border-yellow-500/20 shadow-lg shadow-black/30"
                >
                  {m.imageUrl && (
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${m.imageUrl})` }}
                    />
                  )}

                  <div className="bg-black/40 p-6">
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
                      <div className="mt-2 space-y-1 text-sm text-gray-300 [&_a]:text-yellow-300 [&_a]:underline [&_a:hover]:text-yellow-200 [&_strong]:text-gray-100 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:leading-relaxed">
                        <ReactMarkdown>{m.details}</ReactMarkdown>
                      </div>
                    )}

                    {(m.slidesUrl || m.recordingUrl) && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {m.slidesUrl && (
                          <a
                            href={m.slidesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/40 px-4 py-1.5 text-sm font-medium text-yellow-300 transition hover:border-yellow-400 hover:text-yellow-200"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                              />
                            </svg>
                            Slides
                          </a>
                        )}
                        {m.recordingUrl && (
                          <a
                            href={m.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/40 px-4 py-1.5 text-sm font-medium text-yellow-300 transition hover:border-yellow-400 hover:text-yellow-200"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Recording
                          </a>
                        )}
                      </div>
                    )}
                  </div>
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
