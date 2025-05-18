// src/app/services/newsService.ts

// Define the structure of an article from the NewsAPI
interface NewsAPIArticle {
  source?: {
    id?: string;
    name?: string;
  };
  author?: string;
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
}

// Define the structure for our app's articles
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
  // Use correct environment variable name (NEWS_API_KEY instead of NEXT_PUBLIC_NEWS_API_KEY)
  const apiKey = process.env.NEWS_API_KEY || "";

  if (!apiKey) {
    console.error("No NEWS_API_KEY found in environment variables");
    return [];
  }

  // Build the API URL
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${apiKey}`;

  try {
    // Server-side fetching - this is the key difference
    // Using server-side fetching from Next.js server rather than from the browser client
    const response = await fetch(url, {
      // Force server-side fetch to bypass the client restriction of NewsAPI
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        // Add potential headers needed for API
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    if (data.status !== "ok") {
      console.error("NewsAPI error:", data.message || "Unknown error");
      return [];
    }

    // If no articles are returned
    if (
      !data.articles ||
      !Array.isArray(data.articles) ||
      data.articles.length === 0
    ) {
      console.log(`No articles found for category: ${category}`);
      return [];
    }

    // Transform and add IDs to the articles
    return data.articles.map((article: NewsAPIArticle, index: number) => ({
      id: `${category}-${index}-${
        article.title?.replace(/\s+/g, "-").toLowerCase().slice(0, 50) || index
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
