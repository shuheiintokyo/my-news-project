// src/app/news-modal/[id]/page.tsx
import { fetchTopHeadlines, NewsArticle } from "@/app/services/newsService";
import Image from "next/image";
import Link from "next/link";
import TwitterFeed from "@/app/components/TwitterFeed";

// Mark this page as dynamic to avoid static generation errors
export const dynamic = "force-dynamic";

// Define the proper Page Props interface for Next.js App Router
interface PageProps {
  params: {
    id: string;
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const id = params.id;

  // Extract category from id (they're formatted as "category-index-title")
  const category = id.split("-")[0];

  // Function to fetch the article
  async function getArticle(
    id: string,
    category: string
  ): Promise<NewsArticle | null> {
    try {
      // Fetch articles from the specific category
      const articles = await fetchTopHeadlines(category);

      // Find the article that best matches our ID
      // We'll do a partial match on the ID since IDs might be generated differently each time
      const article = articles.find((article) => {
        // Check if the ID contains parts of the requested ID
        // This is more flexible than an exact match
        return article.id.includes(id) || id.includes(article.id);
      });

      // If no direct match, try to find by looking for the headline in the ID
      if (!article) {
        // Extract headline words from the ID
        const idWords = id
          .split("-")
          .slice(2)
          .filter((word) => word.length > 3);

        // If we have words to match
        if (idWords.length > 0) {
          // Try to find an article whose title contains most of these words
          return (
            articles.find((article) => {
              const titleLower = article.title.toLowerCase();
              // Count how many ID words appear in the title
              const matchCount = idWords.filter((word) =>
                titleLower.includes(word.toLowerCase())
              ).length;

              // If more than half the words match, consider it a match
              return matchCount > idWords.length / 2;
            }) || null
          );
        }
      }

      return article || null;
    } catch (error) {
      console.error("Error fetching article:", error);
      return null;
    }
  }

  // Fetch the article
  const article = await getArticle(id, category);

  // Handle article not found
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">
            The article you&apos;re looking for could not be found.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Enhance the content display logic to handle limited content
  const enhancedContent =
    article.content || "No full content available from this source.";

  // Remove the "[+XXXX chars]" suffix from content if present
  const cleanContent = enhancedContent.replace(/\[\+\d+ chars\]$/, "");

  // Generate a message about content limitations
  const contentLimitMessage = enhancedContent.includes("[+")
    ? "Note: This is a preview. The full article is available on the publisher's website."
    : "";

  // Create a suggested read more link using the article URL
  const readMoreLink = article.url && article.url !== "#" ? article.url : null;
  
  // Create a search query for Twitter by extracting key terms from the article title
  const createTwitterQuery = (title: string): string => {
    // Remove common words and punctuation
    const stopWords = ["a", "and", "the", "in", "of", "to", "for", "on", "with", "by", "as", "is", "at"];
    const words = title
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .split(" ")
      .filter(word => word.length > 3 && !stopWords.includes(word)); // Remove stop words and short words
      
    // Take the most important 3-4 words to avoid too specific queries
    const keyTerms = words.slice(0, 4);
    
    // Add the category as a hashtag for relevance
    return `${keyTerms.join(" ")} #${category}`;
  };
  
  // Generate Twitter search query based on the article title
  const twitterQuery = createTwitterQuery(article.title);

  // Display the article
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {article.urlToImage && (
          <div className="relative w-full h-80">
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
            <span>{article.source.name}</span>
            <span className="mx-2">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>

          <p className="text-lg mb-6">{article.description}</p>

          <div className="prose dark:prose-invert max-w-none">
            {cleanContent === "No full content available from this source." ? (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  {cleanContent}
                </p>
              </div>
            ) : (
              <p>{cleanContent}</p>
            )}

            {contentLimitMessage && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-md">
                <p>{contentLimitMessage}</p>
              </div>
            )}

            {readMoreLink && (
              <div className="mt-6">
                
                  href={readMoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-block"
                >
                  Read Full Article on {article.source.name}
                </a>
              </div>
            )}
          </div>

          {/* Twitter Feed Section */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <TwitterFeed query={twitterQuery} />
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
            >
              Back to News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}