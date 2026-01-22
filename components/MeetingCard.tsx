import { Meeting } from "@/db/schema";

interface MeetingCardProps {
  meeting: Meeting | null;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  if (!meeting) {
    return (
      <div className="rounded-lg bg-gray-800 p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-gray-100">Next Meeting</h2>
        <p className="text-gray-400">No upcoming meeting scheduled.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">{meeting.title}</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <svg
            className="mr-2 h-5 w-5"
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
            {new Date(meeting.datetime).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
        <div className="flex items-center">
          <svg
            className="mr-2 h-5 w-5"
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
        <p className="mt-4 text-white/90">{meeting.details}</p>
      )}
      {meeting.rsvpLink && (
        <a
          href={meeting.rsvpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-gray-100"
        >
          RSVP Now
        </a>
      )}
    </div>
  );
}
