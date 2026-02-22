import { getAllNews } from "@/app/actions/news";

export async function GET() {
  try {
    // First try NewsAPI for auto-fetched articles
    const apiKey = process.env.NEWS_API_KEY;
    let apiArticles: any[] = [];

    if (apiKey) {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=artificial+intelligence&sortBy=publishedAt&pageSize=6&language=en&apiKey=${apiKey}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      if (data.articles) {
        apiArticles = data.articles.map((a: any) => ({
          id: a.url,
          title: a.title,
          summary: a.description,
          url: a.url,
          source: a.source.name,
          publishedAt: a.publishedAt,
          imageUrl: a.urlToImage,
          isManual: false,
        }));
      }
    }

    // Also get manual news from database
    const manualNews = await getAllNews();
    const manualArticles = manualNews
      .filter((n) => n.isActive)
      .map((n) => ({
        id: String(n.id),
        title: n.title,
        summary: n.summary,
        url: n.url,
        source: n.source,
        publishedAt: n.publishedAt,
        imageUrl: null,
        isManual: true,
      }));

    // Manual news first, then auto-fetched
    const combined = [...manualArticles, ...apiArticles];

    return Response.json(combined);
  } catch (error) {
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
