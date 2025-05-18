// src/app/components/NewsCard.tsx
import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "../services/newsService";

export default function NewsCard({ article }: { article: NewsArticle }) {
  // Get the first 100 characters of content
  const excerpt =
    article.description.length > 100
      ? `${article.description.substring(0, 100)}...`
      : article.description;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow">
      {article.urlToImage && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
      <p className="mb-4">{excerpt}</p>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(article.publishedAt).toLocaleDateString()}
        </p>
        <Link
          href={`/news/${article.id}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more &gt;&gt;&gt;
        </Link>
      </div>
    </div>
  );
}
