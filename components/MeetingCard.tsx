import { Meeting } from "@/db/schema";
import ReactMarkdown from "react-markdown";

interface MeetingCardProps {
  meeting: Meeting | null;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  if (!meeting) {
    return (
      <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
        <h2 className="mb-2 text-2xl font-bold text-yellow-300">
          Next Meeting
        </h2>
        <p className="text-gray-300">No upcoming meeting scheduled.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-black/40 shadow-lg shadow-black/30">
      {/* Header strip */}
      <div className="border-b border-yellow-500/20 bg-black px-6 py-4">
        <div className="text-xs font-semibold tracking-wide text-yellow-400 uppercase">
          Next Meeting
        </div>
        <h2 className="mt-1 text-2xl font-bold text-gray-100">
          {meeting.title}
        </h2>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="space-y-3 text-gray-200">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {new Date(meeting.datetime).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "America/Chicago",
              })}
            </span>
          </div>

          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-yellow-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{meeting.location}</span>
          </div>
        </div>

        {meeting.details && (
          <div className="mt-4 space-y-1 text-sm text-gray-200 [&_a]:text-yellow-300 [&_a]:underline [&_a:hover]:text-yellow-200 [&_strong]:text-gray-100 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:leading-relaxed">
            <ReactMarkdown>{meeting.details}</ReactMarkdown>
          </div>
        )}

      </div>
    </div>
  );
}
