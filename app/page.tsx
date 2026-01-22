import Header from "@/components/Header";
import MeetingCard from "@/components/MeetingCard";
import { db } from "@/db";
import { meeting } from "@/db/schema";

export default async function Home() {
  const meetings = await db.select().from(meeting).limit(1);
  const nextMeeting = meetings[0] || null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-100">
              Welcome to Applied AI
            </h1>
            <p className="text-xl text-gray-400">
              University of Iowa&apos;s student organization for applied
              artificial intelligence and machine learning
            </p>
          </div>

          <div className="mb-12">
            <MeetingCard meeting={nextMeeting} />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Learn
              </h3>
              <p className="mb-4 text-gray-400">
                Access our curated collection of tutorials and learning
                resources.
              </p>
              <a
                href="/tutorials"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Browse Tutorials →
              </a>
            </div>

            <div className="rounded-lg bg-gray-800 p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold text-gray-100">
                Projects
              </h3>
              <p className="mb-4 text-gray-400">
                Explore projects created by our members and the community.
              </p>
              <a
                href="/projects"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                View Projects →
              </a>
            </div>

            <div className="rounded-lg bg-gray-800 p-6 shadow">
              <h3 className="mb-2 text-lg font-semibold text-gray-100">Team</h3>
              <p className="mb-4 text-gray-400">
                Meet the executive board members leading our organization.
              </p>
              <a
                href="/board"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Meet the Team →
              </a>
            </div>
          </div>
        </div>
                  {/* Applied AI Studio Sections */}
          <div className="mt-16 space-y-16">

            {/* Workshops */}
            <section id="workshops" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Applied AI Studio Workshops
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Pick a workshop and build something you can demo — beginner-friendly and resume-ready.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Resume Feedback Bot",
                    level: "Beginner",
                    time: "60–90 min",
                    tools: "ChatGPT + Zapier",
                    desc: "Form intake → AI scoring → feedback email.",
                    href: "/tutorials",
                  },
                  {
                    title: "Job Application Tracker",
                    level: "Beginner",
                    time: "45–60 min",
                    tools: "Google Sheets + GPT",
                    desc: "Track roles, auto-summarize job posts, and generate follow-ups.",
                    href: "/tutorials",
                  },
                  {
                    title: "Customer Feedback Analyzer",
                    level: "Intermediate",
                    time: "90 min",
                    tools: "Python + GPT",
                    desc: "Cluster feedback, extract themes, and generate action items.",
                    href: "/tutorials",
                  },
                  {
                    title: "Outreach Email Generator",
                    level: "Beginner",
                    time: "30–45 min",
                    tools: "ChatGPT",
                    desc: "Generate personalized networking outreach in your voice.",
                    href: "/tutorials",
                  },
                ].map((w) => (
                  <div key={w.title} className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                        {w.level}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">• {w.time}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">• {w.tools}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {w.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {w.desc}
                    </p>
                    <a
                      href={w.href}
                      className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                    >
                      Start Workshop →
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Podcast Episodes */}
            <section id="episodes" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Podcast Episodes
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Short, practical episodes you can follow along with.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { num: "01", title: "Prompting for Reliable Outputs", minutes: "18 min", tag: "Prompting", desc: "Turn vague prompts into consistent, structured results." },
                  { num: "02", title: "From Form → GPT → Email", minutes: "22 min", tag: "Automation", desc: "Build a workflow that sends feedback automatically." },
                  { num: "03", title: "Evaluating & Iterating Rubrics", minutes: "15 min", tag: "Testing", desc: "Improve quality with rubrics, examples, and quick eval loops." },
                  { num: "04", title: "Packaging Your Project for GitHub", minutes: "12 min", tag: "Portfolio", desc: "Make it resume-ready with a README + demo." },
                  { num: "05", title: "Using Copilot in Excel", minutes: "16 min", tag: "Copilot", desc: "Speed up analysis, formulas, and summaries in spreadsheets." },
                  { num: "06", title: "Building a Simple n8n Workflow", minutes: "20 min", tag: "n8n", desc: "Automate multi-step tasks without building a full backend." },
                ].map((e) => (
                  <div key={e.num} className="flex items-start gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                    <button
                      type="button"
                      className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      aria-label={`Play episode ${e.num}`}
                    >
                      ▶
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Ep {e.num}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">• {e.minutes}</span>
                        <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-200">
                          {e.tag}
                        </span>
                      </div>
                      <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {e.title}
                      </div>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {e.desc}
                      </p>
                    </div>

                    <a
                      href="/tutorials"
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Tools */}
            <section id="tools" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  AI Tools & Resources
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Quick guides to the tools students actually use.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "ChatGPT", desc: "Prompting, drafts, analysis" },
                  { name: "Microsoft Copilot", desc: "Docs & Excel help" },
                  { name: "Zapier", desc: "No-code automation" },
                  { name: "n8n", desc: "Workflow automation" },
                  { name: "Notion AI", desc: "Notes + knowledge base" },
                  { name: "Perplexity", desc: "Research" },
                  { name: "Canva", desc: "Slides + assets" },
                  { name: "GitHub", desc: "Portfolio hosting" },
                ].map((t) => (
                  <div key={t.name} className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.desc}</div>
                    <a
                      href="/tutorials"
                      className="mt-3 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                    >
                      Guide →
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Toolkits:{" "}
                <a className="text-indigo-600 dark:text-indigo-400 hover:underline" href="/tutorials">Prompt Library</a>
                {" • "}
                <a className="text-indigo-600 dark:text-indigo-400 hover:underline" href="/tutorials">Templates</a>
                {" • "}
                <a className="text-indigo-600 dark:text-indigo-400 hover:underline" href="/tutorials">Starter Repos</a>
              </div>
            </section>

            {/* Questions + Contact */}
            <section id="contact" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Questions & Contact
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Ask anything about workshops, tools, or projects — we’ll get back to you.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* FAQ */}
                <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    FAQ
                  </h3>

                  <div className="space-y-3 text-gray-600 dark:text-gray-400">
                    {[
                      ["Do I need coding experience?", "No. Many workshops are beginner-friendly and focus on tools first."],
                      ["How do workshops work?", "Watch a short episode, follow along, then bring questions to meetings/office hours."],
                      ["What do I put on my resume?", "Your deliverable, the tools used, and the impact. We provide a resume bullet template."],
                      ["Can I join mid-semester?", "Yes — workshops are designed to be modular so you can jump in anytime."],
                      ["How do I get help?", "Use the question form and bring issues to weekly help time at meetings."],
                      ["What tools do I need?", "A laptop + free accounts for common tools (ChatGPT, GitHub, etc.)."],
                    ].map(([q, a]) => (
                      <div key={q} className="rounded-md border border-gray-200 dark:border-gray-700 p-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{q}</div>
                        <div className="mt-1 text-sm">{a}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ask a question + contact cards */}
                <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Ask a Question
                  </h3>

                  <div className="space-y-3">
                    <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100" placeholder="Name" />
                    <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100" placeholder="Email" />
                    <textarea className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100" placeholder="Your question" rows={4} />
                    <button className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
                      Submit
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      (We can connect this to Google Forms/Formspree later — this is a visual mock for now.)
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">appliedai@uiowa.edu</div>
                    </div>
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 p-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Community</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">Discord / Slack</div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Link coming soon</div>
                    </div>
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 p-4 sm:col-span-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Weekly meeting</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                        Tuesdays 8:00–9:30 AM • Any weekday after 2:30 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

      </main>
    </>
  );
}
