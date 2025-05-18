// src/app/services/guardianService.ts

// Define the structure of an article from The Guardian API
interface GuardianArticle {
  id?: string;
  webTitle?: string;
  webUrl?: string;
  webPublicationDate?: string;
  fields?: {
    headline?: string;
    trailText?: string;
    bodyText?: string;
    thumbnail?: string;
  };
  sectionName?: string;
}

// Guardian API response format
interface GuardianResponse {
  response?: {
    status?: string;
    results?: GuardianArticle[];
  };
}

// Keep our existing NewsArticle type for consistency
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

export async function fetchGuardianHeadlines(
  section: string = "technology"
): Promise<NewsArticle[]> {
  // Map our categories to Guardian sections if needed
  const sectionMap: Record<string, string> = {
    technology: "technology",
    business: "business",
    health: "lifeandstyle",
    entertainment: "culture",
    sports: "sport",
    science: "science",
    // Add more mappings as needed
  };

  const guardianSection = sectionMap[section] || "news";

  // Use Guardian API key
  const apiKey = process.env.GUARDIAN_API_KEY || "";

  if (!apiKey) {
    console.error("No GUARDIAN_API_KEY found in environment variables");
    return [];
  }

  // Build The Guardian API URL with fields we want to retrieve
  const url = `https://content.guardianapis.com/search?section=${guardianSection}&show-fields=headline,trailText,bodyText,thumbnail&page-size=10&api-key=${apiKey}`;

  try {
    // Server-side fetch
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

    const data: GuardianResponse = await response.json();

    // Check if articles exist
    if (
      !data.response?.results ||
      !Array.isArray(data.response.results) ||
      data.response.results.length === 0
    ) {
      console.log(`No articles found for section: ${section}`);
      return [];
    }

    // Transform Guardian format to our NewsArticle format
    return data.response.results.map(
      (article: GuardianArticle, index: number) => {
        // Create a consistent ID including enough info to match later
        const titleForId =
          article.webTitle
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 50) || `article-${index}`;

        return {
          id: `guardian-${section}-${index}-${titleForId}`, // Add guardian prefix to distinguish the source
          title:
            article.fields?.headline ||
            article.webTitle ||
            "No title available",
          content: article.fields?.bodyText || "No content available",
          description: article.fields?.trailText || "No description available",
          urlToImage:
            article.fields?.thumbnail ||
            "https://placehold.co/600x400?text=Guardian",
          publishedAt: article.webPublicationDate || new Date().toISOString(),
          url: article.webUrl || "#",
          source: {
            name: "The Guardian",
          },
        };
      }
    );
  } catch (error) {
    console.error("Error fetching Guardian news:", error);
    return [];
  }
}
