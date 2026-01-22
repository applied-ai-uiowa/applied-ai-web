import Header from "@/components/Header";
import { db } from "@/db";
import { boardMembers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import Image from "next/image";

export default async function BoardPage() {
  const members = await db
    .select()
    .from(boardMembers)
    .where(eq(boardMembers.isActive, true))
    .orderBy(asc(boardMembers.sortOrder));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-100">
              Executive Board
            </h1>
            <p className="text-xl text-gray-400">
              Meet the team leading Applied AI at the University of Iowa
            </p>
          </div>

          {members.length === 0 ? (
            <div className="rounded-lg bg-gray-800 p-6 text-center shadow">
              <p className="text-gray-400">
                No board members to display yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg bg-gray-800 p-6 shadow transition-shadow hover:shadow-lg"
                >
                  {member.photoUrl && (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
                    />
                  )}
                  {!member.photoUrl && (
                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-indigo-900">
                      <span className="text-3xl font-bold text-indigo-400">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                  <h3 className="mb-1 text-center text-xl font-semibold text-gray-100">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-center font-medium text-indigo-400">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="mb-4 text-center text-sm text-gray-400">
                      {member.bio}
                    </p>
                  )}
                  <div className="flex justify-center gap-4">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-300"
                        aria-label="LinkedIn"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-300"
                        aria-label="GitHub"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
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
