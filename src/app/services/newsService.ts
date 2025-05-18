// src/app/services/newsService.ts
export type NewsArticle = {
  id: string;
  title: string;
  content: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  url: string;
  source: {
    name: string;
  };
};

export async function fetchTopHeadlines(
  category: string = "technology"
): Promise<NewsArticle[]> {
  // Replace with your API key from NewsAPI.org
  const apiKey = "YOUR_API_KEY_HERE";
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("Failed to fetch news");
    }

    // Transform and add IDs to the articles
    return data.articles.map((article: any, index: number) => ({
      id: `${index}-${
        article.title?.replace(/\s+/g, "-").toLowerCase() || index
      }`,
      title: article.title || "No title available",
      content: article.content || "No content available",
      description: article.description || "No description available",
      urlToImage:
        article.urlToImage || "https://placehold.co/600x400?text=No+Image",
      publishedAt: article.publishedAt || new Date().toISOString(),
      url: article.url || "#",
      source: {
        name: article.source?.name || "Unknown Source",
      },
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
