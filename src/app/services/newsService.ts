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
  // Use correct environment variable name
  const apiKey = process.env.NEWS_API_KEY || "";

  if (!apiKey) {
    console.error("No NEWS_API_KEY found in environment variables");
    return [];
  }

  // Build the API URL with increased pageSize to get more articles
  // Note: Free tier limit is 100 requests per day, so keeping pageSize reasonable
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=10&apiKey=${apiKey}`;

  try {
    // Force server-side fetch to bypass the client restriction of NewsAPI
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
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

    // Process special cases in content to make it display better
    const processContent = (content: string | undefined) => {
      if (!content) return "No content available";

      // Identify truncated content (ends with [+XXXX chars])
      const truncatedMatch = content.match(/\[\+(\d+) chars\]$/);
      if (truncatedMatch) {
        const charCount = parseInt(truncatedMatch[1], 10);
        // Format based on how much content is missing
        if (charCount > 5000) {
          return (
            content +
            " (This is just a preview. The full article is much longer.)"
          );
        } else {
          return content;
        }
      }

      return content;
    };

    // Transform and add IDs to the articles
    return data.articles.map((article: NewsAPIArticle, index: number) => {
      // Create a consistent ID that includes enough info to match later
      const titleForId =
        article.title
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 50) || `article-${index}`;

      return {
        id: `${category}-${index}-${titleForId}`,
        title: article.title || "No title available",
        content: processContent(article.content),
        description: article.description || "No description available",
        urlToImage:
          article.urlToImage || "https://placehold.co/600x400?text=No+Image",
        publishedAt: article.publishedAt || new Date().toISOString(),
        url: article.url || "#",
        source: {
          name: article.source?.name || "Unknown Source",
        },
      };
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
