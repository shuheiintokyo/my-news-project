// src/app/news-modal/[id]/page.tsx
import { fetchTopHeadlines, NewsArticle } from "@/app/services/newsService";
import Image from "next/image";
import Link from "next/link";

// Define the proper Page Props interface for Next.js App Router
interface PageProps {
  params: {
    id: string;
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const id = params.id;

  // Function to fetch the article
  async function getArticle(id: string): Promise<NewsArticle | null> {
    try {
      // Try to find the article in different categories
      const categories = ["technology", "business", "health"];

      for (const category of categories) {
        const articles = await fetchTopHeadlines(category);
        const article = articles.find((article) => article.id === id);
        if (article) return article;
      }

      return null;
    } catch (error) {
      console.error("Error fetching article:", error);
      return null;
    }
  }

  // Fetch the article
  const article = await getArticle(id);

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
            <p>{article.content}</p>
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
