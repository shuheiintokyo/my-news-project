// src/app/page.tsx
import { Suspense } from "react";
import { fetchTopHeadlines } from "./services/newsService";
import { fetchGuardianHeadlines } from "./services/guardianService";
import { fetchRedditPosts, fetchTrendingRedditPosts } from "./services/redditService";
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

// A component to fetch and display news by category from NewsAPI
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

// A component to fetch and display news from The Guardian
async function GuardianSection({ section }: { section: string }) {
  const articles = await fetchGuardianHeadlines(section);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <span className="mr-2">📰</span>
        The Guardian: {section.charAt(0).toUpperCase() + section.slice(1)}
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

// A component to fetch and display trending Reddit posts
async function RedditTrendingSection() {
  const posts = await fetchTrendingRedditPosts();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <span className="mr-2">🔥</span>
        Reddit Trending Posts
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post) => (
          <NewsCard key={post.id} article={post} />
        ))}
      </div>
    </div>
  );
}

// A component to fetch and display posts from a specific subreddit
async function RedditSubredditSection({ subreddit }: { subreddit: string }) {
  const posts = await fetchRedditPosts(subreddit, 6);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <span className="mr-2">📱</span>
        Reddit: r/{subreddit}
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <NewsCard key={post.id} article={post} />
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
        <p className="text-xl">
          Your source for the latest news from multiple sources
        </p>
      </header>

      {/* MAIN SECTION with news categories */}
      <main className="max-w-6xl mx-auto space-y-16">
        {/* NewsAPI Technology News */}
        <Suspense
          fallback={
            <div>
              <h2 className="text-3xl font-bold mb-6 capitalize">
                Technology News
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <LoadingCard key={i} title="Loading..." />
                ))}
              </div>
            </div>
          }
        >
          <NewsCategorySection category="technology" />
        </Suspense>

        {/* The Guardian News */}
        <Suspense
          fallback={
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="mr-2">📰</span>
                The Guardian: Technology
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <LoadingCard key={i} title="Loading..." />
                ))}
              </div>
            </div>
          }
        >
          <GuardianSection section="technology" />
        </Suspense>

        {/* Reddit Trending Posts */}
        <Suspense
          fallback={
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="mr-2">🔥</span>
                Reddit Trending Posts
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <LoadingCard key={i} title="Loading..." />
                ))}
              </div>
            </div>
          }
        >
          <RedditTrendingSection />
        </Suspense>

        {/* Reddit Technology Subreddit */}
        <Suspense
          fallback={
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <span className="mr-2">📱</span>
                Reddit: r/technology
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <LoadingCard key={i} title="Loading..." />
                ))}
              </div>
            </div>
          }
        >
          <RedditSubredditSection subreddit="technology" />
        </Suspense>

        {/* NewsAPI Business News */}
        <Suspense
          fallback={
            <div>
              <h2 className="text-3xl font-bold mb-6 capitalize">
                Business News
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <LoadingCard key={i} title="Loading..." />
                ))}
              </div>
            </div>
          }
        >
          <NewsCategorySection category="business" />
        </Suspense>

        {/* NewsAPI Health News */}
        <Suspense
          fallback={
            <div>
              <h2 className="text-3xl font-bold mb-6 capitalize">
                Health News
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <LoadingCard key={i} title="Loading..." />
                ))}
              </div>
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
          Powered by NewsAPI, The Guardian, and Reddit
        </p>
      </footer>
    </div>
  );
}
