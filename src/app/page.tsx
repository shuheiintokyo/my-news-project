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
  console.log('🔥 RedditTrendingSection component is rendering...');
  
  try {
    const posts = await fetchTrendingRedditPosts();
    console.log(`🔥 RedditTrendingSection got ${posts.length} posts`);

    if (posts.length === 0) {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-2">🔥</span>
            Reddit Trending Posts
          </h2>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              ⚠️ No Reddit posts found. Check console logs for debugging information.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-2">🔥</span>
          Reddit Trending Posts ({posts.length} found)
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post) => (
            <NewsCard key={post.id} article={post} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ RedditTrendingSection error:', error);
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-2">🔥</span>
          Reddit Trending Posts
        </h2>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            ❌ Error loading Reddit posts: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
}

// A component to fetch and display posts from a specific subreddit
async function RedditSubredditSection({ subreddit }: { subreddit: string }) {
  console.log(`📱 RedditSubredditSection component rendering for r/${subreddit}...`);
  
  try {
    const posts = await fetchRedditPosts(subreddit, 6);
    console.log(`📱 RedditSubredditSection got ${posts.length} posts from r/${subreddit}`);

    if (posts.length === 0) {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="mr-2">📱</span>
            Reddit: r/{subreddit}
          </h2>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              ⚠️ No posts found in r/{subreddit}. Check console logs for debugging information.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-2">📱</span>
          Reddit: r/{subreddit} ({posts.length} found)
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <NewsCard key={post.id} article={post} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(`❌ RedditSubredditSection error for r/${subreddit}:`, error);
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-2">📱</span>
          Reddit: r/{subreddit}
        </h2>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            ❌ Error loading r/{subreddit}: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
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
