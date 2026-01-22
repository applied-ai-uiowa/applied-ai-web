import Header from "@/components/Header";
import { db } from "@/db";
import { tutorials } from "@/db/schema";
import { asc } from "drizzle-orm";

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
                    {items.map((tutorial) => (
                      <a
                        key={tutorial.id}
                        href={tutorial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-gray-800 p-6 shadow transition-shadow hover:shadow-lg"
                      >
                        <h3 className="mb-2 text-lg font-semibold text-gray-100">
                          {tutorial.title}
                        </h3>
                        <div className="flex items-center text-sm text-indigo-400">
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          View Tutorial
                        </div>
                      </a>
                    ))}
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
