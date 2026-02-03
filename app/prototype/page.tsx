import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function PrototypePage() {
  const workshops = [
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
  ];

  const episodes = [
    {
      num: "01",
      title: "Prompting for Reliable Outputs",
      minutes: "8 min",
      tag: "Prompting",
      desc: "Turn vague prompts into consistent, structured results.",
    },
    {
      num: "02",
      title: "From Form → GPT → Email",
      minutes: "22 min",
      tag: "Automation",
      desc: "Build a workflow that sends feedback automatically.",
    },
    {
      num: "03",
      title: "Evaluating & Iterating Rubrics",
      minutes: "15 min",
      tag: "Testing",
      desc: "Improve quality with rubrics, examples, and quick eval loops.",
    },
    {
      num: "04",
      title: "Packaging Your Project for GitHub",
      minutes: "12 min",
      tag: "Portfolio",
      desc: "Make it resume-ready with a README + demo.",
    },
    {
      num: "05",
      title: "Using Copilot in Excel",
      minutes: "16 min",
      tag: "Copilot",
      desc: "Speed up analysis, formulas, and summaries in spreadsheets.",
    },
    {
      num: "06",
      title: "Building a Simple n8n Workflow",
      minutes: "20 min",
      tag: "n8n",
      desc: "Automate multi-step tasks without building a full backend.",
    },
  ];

  const tools = [
    { name: "ChatGPT", desc: "Prompting, drafts, analysis" },
    { name: "Microsoft Copilot", desc: "Docs & Excel help" },
    { name: "Zapier", desc: "No-code automation" },
    { name: "n8n", desc: "Workflow automation" },
    { name: "Notion AI", desc: "Notes + knowledge base" },
    { name: "Perplexity", desc: "Research" },
    { name: "Canva", desc: "Slides + assets" },
    { name: "GitHub", desc: "Portfolio hosting" },
  ];

  const faqs: Array<[string, string]> = [
    [
      "Do I need coding experience?",
      "No. Many workshops are beginner-friendly and focus on tools first.",
    ],
    [
      "How do workshops work?",
      "Watch a short episode, follow along, then bring questions to meetings/office hours.",
    ],
    [
      "What do I put on my resume?",
      "Your deliverable, the tools used, and the impact. We provide a resume bullet template.",
    ],
    [
      "Can I join mid-semester?",
      "Yes — workshops are designed to be modular so you can jump in anytime.",
    ],
    [
      "How do I get help?",
      "Use the question form and bring issues to weekly help time at meetings.",
    ],
    [
      "What tools do I need?",
      "A laptop + free accounts for common tools (ChatGPT, GitHub, etc.).",
    ],
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-yellow-400 sm:text-5xl">
              Prototype Page
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-gray-200">
              Staging area for features not yet fully implemented. These sections
              are being developed and tested before going live.
            </p>
          </div>

          {/* Applied AI Studio Sections */}
          <div className="mt-16 space-y-16">
            {/* Workshops */}
            <section id="workshops" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-yellow-300">
                  Applied AI Studio Workshops
                </h2>
                <p className="mt-2 text-gray-200">
                  Pick a workshop and build something you can demo —
                  beginner-friendly and resume-ready.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {workshops.map((w) => (
                  <div
                    key={w.title}
                    className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-yellow-500/30 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-200">
                        {w.level}
                      </span>
                      <span className="text-sm text-gray-300">• {w.time}</span>
                      <span className="text-sm text-gray-300">• {w.tools}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-200">
                      {w.title}
                    </h3>
                    <p className="mt-2 text-gray-200">{w.desc}</p>
                    <Link
                      href={w.href}
                      className="mt-4 inline-block font-medium text-yellow-300 hover:text-yellow-200"
                    >
                      Start Workshop →
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Podcast Episodes */}
            <section id="episodes" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-yellow-300">
                  Podcast Episodes
                </h2>
                <p className="mt-2 text-gray-200">
                  Short, practical episodes you can follow along with.
                </p>
              </div>

              <div className="space-y-3">
                {episodes.map((e) => (
                  <div
                    key={e.num}
                    className="flex items-start gap-4 rounded-2xl border border-yellow-500/20 bg-black/40 p-5 shadow-lg shadow-black/20"
                  >
                    <button
                      type="button"
                      className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/30 text-yellow-200 transition hover:bg-yellow-400/10"
                      aria-label={`Play episode ${e.num}`}
                    >
                      ▶
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-yellow-200">
                          Ep {e.num}
                        </span>
                        <span className="text-sm text-gray-300">
                          • {e.minutes}
                        </span>
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-400/10 px-2 py-0.5 text-xs text-yellow-200">
                          {e.tag}
                        </span>
                      </div>
                      <div className="mt-1 text-lg font-semibold text-gray-100">
                        {e.title}
                      </div>
                      <p className="mt-1 text-gray-200">{e.desc}</p>
                    </div>

                    <Link
                      href="/tutorials"
                      className="text-sm font-medium text-yellow-300 hover:text-yellow-200"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Tools */}
            <section id="tools" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-yellow-300">
                  AI Tools & Resources
                </h2>
                <p className="mt-2 text-gray-200">
                  Quick guides to the tools students actually use.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {tools.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-2xl border border-yellow-500/20 bg-black/40 p-4 shadow-lg shadow-black/20"
                  >
                    <div className="font-semibold text-gray-100">{t.name}</div>
                    <div className="mt-1 text-sm text-gray-200">{t.desc}</div>
                    <Link
                      href="/tutorials"
                      className="mt-3 inline-block text-sm font-medium text-yellow-300 hover:text-yellow-200"
                    >
                      Guide →
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-200">
                Toolkits:{" "}
                <Link
                  className="text-yellow-300 hover:underline"
                  href="/tutorials"
                >
                  Prompt Library
                </Link>
                {" • "}
                <Link
                  className="text-yellow-300 hover:underline"
                  href="/tutorials"
                >
                  Templates
                </Link>
                {" • "}
                <Link
                  className="text-yellow-300 hover:underline"
                  href="/tutorials"
                >
                  Starter Repos
                </Link>
              </div>
            </section>

            {/* Questions + Contact */}
            <section id="contact" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-yellow-300">
                  Questions & Contact
                </h2>
                <p className="mt-2 text-gray-200">
                  Ask anything about workshops, tools, or projects — we&apos;ll get
                  back to you.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* FAQ */}
                <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
                  <h3 className="mb-4 text-lg font-semibold text-yellow-200">
                    FAQ
                  </h3>

                  <div className="space-y-3 text-gray-200">
                    {faqs.map(([q, a]) => (
                      <div
                        key={q}
                        className="rounded-xl border border-yellow-500/20 bg-black/30 p-4"
                      >
                        <div className="font-medium text-gray-100">{q}</div>
                        <div className="mt-1 text-sm text-gray-200">{a}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ask a question (visual mock) */}
                <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
                  <h3 className="mb-4 text-lg font-semibold text-yellow-200">
                    Ask a Question
                  </h3>

                  <div className="space-y-3">
                    <input
                      className="w-full rounded-xl border border-yellow-500/20 bg-black/30 px-4 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                      placeholder="Name"
                    />
                    <input
                      className="w-full rounded-xl border border-yellow-500/20 bg-black/30 px-4 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                      placeholder="Email"
                    />
                    <textarea
                      className="w-full rounded-xl border border-yellow-500/20 bg-black/30 px-4 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                      placeholder="Your question"
                      rows={4}
                    />
                    <button className="w-full rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-black transition hover:bg-yellow-300">
                      Submit
                    </button>
                    <p className="text-xs text-gray-300">
                      (We can connect this to Google Forms/Formspree or your
                      Neon DB later — this is a visual mock for now.)
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-yellow-500/20 bg-black/30 p-4">
                      <div className="text-sm text-gray-300">Email</div>
                      <div className="mt-1 font-medium text-gray-100">
                        appliedai@uiowa.edu
                      </div>
                    </div>
                    <div className="rounded-xl border border-yellow-500/20 bg-black/30 p-4">
                      <div className="text-sm text-gray-300">Community</div>
                      <div className="mt-1 font-medium text-gray-100">
                        Discord / Slack
                      </div>
                      <div className="mt-1 text-sm text-gray-300">
                        Link coming soon
                      </div>
                    </div>
                    <div className="rounded-xl border border-yellow-500/20 bg-black/30 p-4 sm:col-span-2">
                      <div className="text-sm text-gray-300">Weekly meeting</div>
                      <div className="mt-1 font-medium text-gray-100">
                        Tuesdays 8:00–9:30 AM • Any weekday after 2:30 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
