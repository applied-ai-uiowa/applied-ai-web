import React from "react";
import { AiNewsItem } from "@/db/schema";
import { getAllNews } from "@/app/actions/news";

async function getAutoNews() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return [];
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=artificial+intelligence&sortBy=publishedAt&pageSize=6&language=en&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const [manualNews, autoArticles] = await Promise.all([
    getAllNews(),
    getAutoNews(),
  ]);

  const activeManual = manualNews.filter((item: AiNewsItem) => item.isActive);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-yellow-950/40 to-black">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-3 text-4xl font-bold text-yellow-400">AI News</h1>
        <p className="mb-10 text-lg text-gray-300">
          Latest in artificial intelligence, curated for you.
        </p>

        {/* Manual/pinned news */}
        {activeManual.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-yellow-500">
              Pinned by Applied AI
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeManual.map((item: AiNewsItem) => {
                const Tag = "a" as unknown as React.ElementType;
                return (
                  <Tag
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-yellow-500/30 bg-yellow-400/10 p-5 transition hover:bg-yellow-400/15"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-100 leading-snug">{item.title}</h3>
                      {item.source && (
                        <span className="shrink-0 rounded-full border border-yellow-500/30 px-2 py-0.5 text-xs text-yellow-300">
                          {item.source}
                        </span>
                      )}
                    </div>
                    {item.summary && (
                      <p className="mt-2 text-sm text-gray-300">{item.summary}</p>
                    )}
                    {item.publishedAt && (
                      <p className="mt-3 text-xs text-gray-500">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </Tag>
                );
              })}
            </div>
          </div>
        )}

        {/* Auto-fetched news */}
        {autoArticles.length > 0 && (
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Latest from the Web
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {autoArticles.map((article: any) => {
                const Tag = "a" as unknown as React.ElementType;
                return (
                  <Tag
                    key={article.url}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden transition hover:border-yellow-500/30"
                  >
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <p className="text-xs text-yellow-500 mb-1">{article.source?.name}</p>
                      <h3 className="text-sm font-semibold text-gray-100 leading-snug">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="mt-2 text-xs text-gray-400 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      <p className="mt-3 text-xs text-gray-600">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Tag>
                );
              })}
            </div>
          </div>
        )}

        {activeManual.length === 0 && autoArticles.length === 0 && (
          <p className="text-gray-500">No news articles yet. Check back soon!</p>
        )}
      </div>
    </main>
  );
}
