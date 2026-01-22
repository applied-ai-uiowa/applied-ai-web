import Header from "@/components/Header";
import { db } from "@/db";
import { tutorials } from "@/db/schema";
import { asc } from "drizzle-orm";
import Image from "next/image";

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
      return urlObj.searchParams.get("v");
    }
    // Handle youtu.be/VIDEO_ID
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1);
    }
  } catch {
    return null;
  }
  return null;
}

// Helper function to get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  // Use maxresdefault for highest quality, fallback to hqdefault if needed
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default async function TutorialsPage() {
  const tutorialList = await db
    .select()
    .from(tutorials)
    .orderBy(asc(tutorials.sortOrder));

  // Group tutorials by category
  const tutorialsByCategory = tutorialList.reduce(
    (acc, tutorial) => {
      if (!acc[tutorial.category]) {
        acc[tutorial.category] = [];
      }
      acc[tutorial.category].push(tutorial);
      return acc;
    },
    {} as Record<string, typeof tutorialList>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-100">Tutorials</h1>
            <p className="text-xl text-gray-400">
              Curated learning resources for AI and machine learning
            </p>
          </div>

          {Object.keys(tutorialsByCategory).length === 0 ? (
            <div className="rounded-lg bg-gray-800 p-6 text-center shadow">
              <p className="text-gray-400">
                No tutorials available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(tutorialsByCategory).map(([category, items]) => (
                <div key={category}>
                  <h2 className="mb-4 text-2xl font-bold text-gray-100">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {items.map((tutorial) => {
                      const thumbnailUrl = getYouTubeThumbnail(tutorial.url);
                      return (
                        <a
                          key={tutorial.id}
                          href={tutorial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="overflow-hidden rounded-lg bg-gray-800 shadow transition-shadow hover:shadow-lg"
                        >
                          {thumbnailUrl && (
                            <div className="relative aspect-video w-full">
                              <Image
                                src={thumbnailUrl}
                                alt={tutorial.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="mb-2 text-lg font-semibold text-gray-100">
                              {tutorial.title}
                            </h3>
                            {tutorial.description && (
                              <p className="text-gray-400">
                                {tutorial.description}
                              </p>
                            )}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
