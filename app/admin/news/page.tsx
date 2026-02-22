import Header from "@/components/Header";
import { getAllNews, createNews, deleteNews, toggleNewsActive } from "@/app/actions/news";

export default async function AdminNewsPage() {
  const items = await getAllNews();

  async function handleCreate(formData: FormData) {
    "use server";
    await createNews({
      title: String(formData.get("title") || ""),
      url: String(formData.get("url") || ""),
      summary: String(formData.get("summary") || "") || undefined,
      source: String(formData.get("source") || "") || undefined,
      publishedAt: String(formData.get("publishedAt") || "") || undefined,
      sortOrder: Number(formData.get("sortOrder") || 0),
      isActive: formData.get("isActive") === "on",
    });
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    await deleteNews(id);
  }

  async function handleToggle(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    await toggleNewsActive(id);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="mb-3 text-4xl font-bold text-yellow-400">
              Admin • AI News
            </h1>
            <p className="text-lg text-gray-200">
              Add, remove, and toggle visibility for news items.
            </p>
          </div>

          {/* Create form */}
          <div className="mb-10 rounded-2xl border border-yellow-500/20 bg-black/40 p-6 shadow-lg shadow-black/30">
            <h2 className="mb-4 text-xl font-semibold text-gray-100">
              Add a news item
            </h2>

            <form action={handleCreate} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-200">Title</label>
                <input
                  name="title"
                  required
                  className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                  placeholder="OpenAI releases..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-200">URL</label>
                <input
                  name="url"
                  required
                  className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-gray-200">
                  Summary (optional)
                </label>
                <textarea
                  name="summary"
                  rows={3}
                  className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                  placeholder="Short summary for the site..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-200">
                  Source (optional)
                </label>
                <input
                  name="source"
                  className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                  placeholder="OpenAI / MIT Tech Review"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-200">
                  Published At (optional)
                </label>
                <input
                  name="publishedAt"
                  type="datetime-local"
                  className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-200">
                  Sort Order
                </label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={0}
                  className="w-full rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm text-gray-200">
                  Active (visible)
                </label>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl border border-yellow-500/30 bg-yellow-400/10 px-4 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-400/15"
                >
                  Add News
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-6 text-center shadow-lg shadow-black/30">
                <p className="text-gray-200">No news items yet.</p>
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className="flex flex-col gap-3 rounded-2xl border border-yellow-500/20 bg-black/40 p-5 shadow-lg shadow-black/20 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-gray-100">
                        {n.title}
                      </span>
                      {!n.isActive && (
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-400/10 px-2 py-0.5 text-xs text-yellow-200">
                          Hidden
                        </span>
                      )}
                      {n.source && (
                        <span className="text-sm text-gray-300">• {n.source}</span>
                      )}
                    </div>

                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block truncate text-sm text-yellow-300 hover:text-yellow-200"
                    >
                      {n.url}
                    </a>

                    {n.summary && (
                      <p className="mt-2 text-sm text-gray-200">{n.summary}</p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <form action={handleToggle}>
                      <input type="hidden" name="id" value={n.id} />
                      <button
                        type="submit"
                        className="rounded-xl border border-yellow-500/30 bg-yellow-400/10 px-3 py-2 text-sm font-medium text-yellow-200 transition hover:bg-yellow-400/15"
                      >
                        {n.isActive ? "Hide" : "Show"}
                      </button>
                    </form>

                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={n.id} />
                      <button
                        type="submit"
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/15"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
