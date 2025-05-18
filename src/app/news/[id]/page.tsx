// src/app/news/[id]/page.tsx
import Image from "next/image";
import { fetchTopHeadlines, NewsArticle } from "../../services/newsService";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch articles from multiple categories to find the one with matching ID
  const categories = ["technology", "business", "health"];
  let targetArticle: NewsArticle | undefined;

  for (const category of categories) {
    const articles = await fetchTopHeadlines(category);
    targetArticle = articles.find((article) => article.id === params.id);
    if (targetArticle) break;
  }

  if (!targetArticle) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {targetArticle.title}
      </h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Source: {targetArticle.source.name}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {new Date(targetArticle.publishedAt).toLocaleString()}
        </p>
      </div>

      {targetArticle.urlToImage && (
        <div className="relative w-full h-96 mb-6">
          <Image
            src={targetArticle.urlToImage}
            alt={targetArticle.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg font-semibold mb-4">
          {targetArticle.description}
        </p>
        <p>{targetArticle.content}</p>

        <a
          href={targetArticle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read full article on {targetArticle.source.name} →
        </a>
      </div>
    </div>
  );
}
