import Header from "@/components/Header";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import Image from "next/image";

// Helper function to extract GitHub repo owner and name from URL
function getGitHubRepoInfo(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("github.com")) return null;
    
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1],
      };
    }
  } catch {
    return null;
  }
  return null;
}

// Helper function to get GitHub Open Graph image URL
function getGitHubOGImage(githubUrl: string): string | null {
  const repoInfo = getGitHubRepoInfo(githubUrl);
  if (!repoInfo) return null;
  
  // GitHub's Open Graph image format
  return `https://opengraph.githubassets.com/1/${repoInfo.owner}/${repoInfo.repo}`;
}

export default async function ProjectsPage() {
  const projectList = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder));

  // Group projects by category
  const projectsByCategory = projectList.reduce(
    (acc, project) => {
      if (!acc[project.category]) {
        acc[project.category] = [];
      }
      acc[project.category].push(project);
      return acc;
    },
    {} as Record<string, typeof projectList>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-100 text-yellow-400">
              Projects
            </h1>
            <p className="text-xl text-gray-200">
              Explore projects from our members and the community
            </p>
          </div>

          {Object.keys(projectsByCategory).length === 0 ? (
            <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 text-center shadow-lg shadow-black/30">
              <p className="text-gray-200">
                No projects available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(projectsByCategory).map(([category, items]) => (
                <div key={category}>
                  <h2 className="mb-4 text-2xl font-bold text-yellow-300">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {items.map((project) => {
                      const ogImageUrl = project.githubUrl 
                        ? getGitHubOGImage(project.githubUrl)
                        : null;
                      
                      return (
                        <a
                          key={project.id}
                          href={project.githubUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-black/40 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
                        >
                          {ogImageUrl && (
                            <div className="relative aspect-video w-full">
                              <Image
                                src={ogImageUrl}
                                alt={project.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="mb-2 text-lg font-semibold text-gray-100">
                              {project.title}
                            </h3>
                            {project.description && (
                              <p className="text-gray-200">
                                {project.description}
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
