// src/app/@modal/(.)news/[id]/page.tsx

import { fetchTopHeadlines, NewsArticle } from "@/app/services/newsService";

// TypeScript type for the page params in Next.js App Router
type Props = {
  params: {
    id: string;
  };
};

// Define the page component according to Next.js conventions
export default async function Page({ params }: Props) {
  // Get the ID from params
  const { id } = params;

  try {
    // Fetch articles from multiple categories to find the one with matching ID
    const categories = ["technology", "business", "health"];
    let targetArticle: NewsArticle | undefined;

    for (const category of categories) {
      const articles = await fetchTopHeadlines(category);
      targetArticle = articles.find((article) => article.id === id);
      if (targetArticle) break;
    }

    if (!targetArticle) {
      return <div>Article not found</div>;
    }

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="bg-white dark:bg-gray-900 max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg relative">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{targetArticle.title}</h2>
            <p>{targetArticle.content}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in modal:", error);
    return <div>Error loading article</div>;
  }
}
