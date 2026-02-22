import Header from "@/components/Header";
import { db } from "@/db";
import { meeting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { submitCheckIn } from "./actions";

export default async function CheckInPage({
  searchParams,
}: {
  searchParams?: { m?: string; ok?: string; error?: string };
}) {
  const meetingId = Number(searchParams?.m ?? "");
  const validId = Number.isFinite(meetingId) && meetingId > 0;

  const rows = validId
    ? await db.select().from(meeting).where(eq(meeting.id, meetingId)).limit(1)
    : [];

  const m = rows[0];

  const ok = searchParams?.ok === "1";
  const error = searchParams?.error;

  const errorMessage =
    error === "invalid_email"
      ? "That email doesn’t look valid."
      : error === "invalid_meeting"
        ? "Invalid meeting link."
        : error === "missing_meeting"
          ? "Missing meeting id."
          : error
            ? "Something went wrong. Please try again."
            : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="mb-3 text-4xl font-bold text-yellow-400">
              Meeting Check-in
            </h1>
            <p className="text-lg text-gray-200">
              Optional check-in — helps us estimate attendance.
            </p>
          </div>

          {!m ? (
            <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 text-center shadow-lg shadow-black/30">
              <p className="text-gray-200">Invalid or missing meeting link.</p>
              <p className="mt-2 text-sm text-gray-300">
                Make sure you scanned the QR code shown at the meeting.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
              <div className="mb-6">
                <div className="text-sm font-medium text-yellow-200">
                  {m.title}
                </div>
                <div className="mt-1 text-sm text-gray-300">
                  Thanks for stopping by ✨
                </div>
              </div>

              {ok && (
                <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">
                  Checked in! 🎉
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {errorMessage}
                </div>
              )}

              <form action={submitCheckIn} className="space-y-4">
                <input type="hidden" name="meetingId" value={m.id} />

                <div>
                  <label className="mb-1 block text-sm text-gray-200">
                    Name (optional)
                  </label>
                  <input
                    name="name"
                    className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                    placeholder="Mahee Shah"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-200">
                    Email (optional)
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                    placeholder="name@uiowa.edu"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-200">
                    Note (optional)
                  </label>
                  <input
                    name="note"
                    className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                    placeholder="First time / interested in projects / etc."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl border border-yellow-500/30 bg-yellow-400/10 px-4 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-400/15"
                >
                  Check in
                </button>

                <p className="pt-2 text-center text-xs text-gray-300">
                  This is optional. We just use it to estimate turnout.
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
