import Header from "@/components/Header";
import { db } from "@/db";
import { episodes } from "@/db/schema";
import { asc } from "drizzle-orm";

export default async function EpisodesPage() {
  const episodeList = await db
    .select()
    .from(episodes)
    .orderBy(asc(episodes.sortOrder));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-yellow-400">
              Podcast Episodes
            </h1>
            <p className="text-xl text-gray-200">
              Short, practical episodes you can follow along with.
            </p>
          </div>

          {episodeList.length === 0 ? (
            <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 text-center shadow-lg shadow-black/30">
              <p className="text-gray-200">
                No episodes available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {episodeList.map((episode, index) => {
                const episodeNum = String(index + 1).padStart(2, "0");
                return (
                  <div
                    key={episode.id}
                    className="flex items-start gap-4 rounded-2xl border border-yellow-500/20 bg-black/40 p-5 shadow-lg shadow-black/20"
                  >
                    {episode.spotifyUrl ? (
                      <a
                        href={episode.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/30 text-yellow-200 transition hover:bg-yellow-400/10"
                        aria-label={`Listen to episode ${episodeNum}`}
                      >
                        ▶
                      </a>
                    ) : (
                      <div
                        className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/20 text-yellow-200/50"
                        aria-hidden
                        title="Coming soon"
                      >
                        ▶
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-yellow-200">
                          Ep {episodeNum}
                        </span>
                        <span className="text-sm text-gray-300">
                          • {episode.durationMinutes} min
                        </span>
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-400/10 px-2 py-0.5 text-xs text-yellow-200">
                          {episode.tag}
                        </span>
                      </div>

                      <div className="mt-1 text-lg font-semibold text-gray-100">
                        {episode.title}
                      </div>
                      {episode.description && (
                        <p className="mt-1 text-gray-200">
                          {episode.description}
                        </p>
                      )}
                    </div>

                    {episode.spotifyUrl ? (
                      <a
                        href={episode.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-yellow-300 hover:text-yellow-200"
                      >
                        Listen
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-gray-400">
                        Soon
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
