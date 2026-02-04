import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { boardMembers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import Image from "next/image";
import { GithubIcon, LinkedInIcon } from "@/components/icons";

export default async function BoardPage() {
  const members = await db
    .select()
    .from(boardMembers)
    .where(eq(boardMembers.isActive, true))
    .orderBy(asc(boardMembers.sortOrder));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-100 text-yellow-400">
              Executive Board
            </h1>
            <p className="text-xl text-gray-200">
              Meet the team leading Applied AI at the University of Iowa
            </p>
          </div>

          {members.length === 0 ? (
            <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 text-center shadow-lg shadow-black/30">
              <p className="text-gray-200">
                No board members to display yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30 transition hover:border-yellow-400/50 hover:bg-black/60"
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
                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-400/10">
                      <span className="text-3xl font-bold text-yellow-200">
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
                  <p className="mb-3 text-center font-medium text-yellow-200">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="mb-4 text-center text-sm text-gray-300">
                      {member.bio}
                    </p>
                  )}
                  <div className="flex justify-center gap-4">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-yellow-200"
                        aria-label="LinkedIn"
                      >
                        <LinkedInIcon className="h-5 w-5" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-yellow-200"
                        aria-label="GitHub"
                      >
                        <GithubIcon className="h-5 w-5" />
                      </a>
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
