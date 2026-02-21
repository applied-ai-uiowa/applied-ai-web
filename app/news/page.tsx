import React from "react";
import { getAllNews } from "@/app/actions/news";
import { AiNewsItem } from "@/db/schema";

export default async function NewsPage() {
  const news = await getAllNews();
  const activeNews = news.filter((item: AiNewsItem) => item.isActive);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">AI News</h1>
      {activeNews.length === 0 ? (
        <p className="text-gray-500">No news articles yet. Check back soon!</p>
      ) : (
        <div className="flex flex-col gap-6">
          {activeNews.map((item: AiNewsItem) => {
            const Tag = "a" as unknown as React.ElementType;
            return (
              <Tag
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <h2 className="font-semibold text-lg leading-snug">{item.title}</h2>
                  {item.source && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.source}</span>
                  )}
                </div>
                {item.summary && (
                  <p className="text-sm text-gray-600 mt-2">{item.summary}</p>
                )}
                {item.publishedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </Tag>
            );
          })}
        </div>
      )}
    </main>
  );
}
