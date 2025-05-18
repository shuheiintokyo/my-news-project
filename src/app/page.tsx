// src/app/page.tsx
import { Suspense } from "react";
import { fetchTopHeadlines } from "./services/newsService";
import NewsCard from "./components/NewsCard";

// Mark this page as dynamic to avoid static generation errors
export const dynamic = "force-dynamic";

// Properly typed props interface
interface LoadingCardProps {
  title: string;
}

// Loading skeleton component
function LoadingCard({ title }: LoadingCardProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg animate-pulse">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-4"></div>
    </div>
  );
}

// A component to fetch and display news by category
async function NewsCategorySection({ category }: { category: string }) {
  const articles = await fetchTopHeadlines(category);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 capitalize">{category} News</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      {/* HEADER SECTION */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">My News Project</h1>
        <p className="text-xl">Your source for the latest news</p>
      </header>

      {/* MAIN SECTION with news categories */}
      <main className="max-w-6xl mx-auto space-y-16">
        {/* Technology News */}
        <Suspense
          fallback={
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} title="Loading..." />
              ))}
            </div>
          }
        >
          <NewsCategorySection category="technology" />
        </Suspense>

        {/* Business News */}
        <Suspense
          fallback={
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} title="Loading..." />
              ))}
            </div>
          }
        >
          <NewsCategorySection category="business" />
        </Suspense>

        {/* Health News */}
        <Suspense
          fallback={
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} title="Loading..." />
              ))}
            </div>
          }
        >
          <NewsCategorySection category="health" />
        </Suspense>
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-16 text-center text-sm">
        <p>© 2025 My News Project - Built with Next.js</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Powered by NewsAPI.org
        </p>
      </footer>
    </div>
  );
}
