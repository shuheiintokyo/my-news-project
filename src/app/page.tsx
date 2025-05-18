import { Suspense } from "react";
import FeaturedStory from "./components/FeaturedStory";
import LatestUpdates from "./components/LatestUpdates";

// Properly typed props interface
interface LoadingCardProps {
  title: string;
}

// Loading skeleton component with proper type definition
function LoadingCard({ title }: LoadingCardProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg animate-pulse">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-4"></div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      {/* HEADER SECTION */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">My News Project</h1>
        <p className="text-xl">Your source for the latest news</p>
      </header>

      {/* MAIN SECTION with parallel rendered components */}
      <main className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Each component loads independently */}
          <Suspense fallback={<LoadingCard title="Featured Story" />}>
            <FeaturedStory />
          </Suspense>

          <Suspense fallback={<LoadingCard title="Latest Updates" />}>
            <LatestUpdates />
          </Suspense>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-16 text-center text-sm">
        <p>© 2025 My News Project - Built with Next.js</p>
      </footer>
    </div>
  );
}
