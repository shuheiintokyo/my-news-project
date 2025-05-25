// src/app/components/RedditFeed.tsx
import Image from "next/image";
import { Suspense } from "react";
import { searchRedditPosts } from "../services/redditService";

// Loading skeleton component
function RedditLoading() {
  return (
    <div className="my-4 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3"
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="ml-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

// Reddit feed content component
async function RedditFeedContent({ query }: { query: string }) {
  const posts = await searchRedditPosts(query, 5);

  if (posts.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
        <p>No relevant Reddit posts found for this topic.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            {post.urlToImage ? (
              <div className="flex-shrink-0">
                <Image
                  src={post.urlToImage}
                  alt={post.title}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
              </div>
            ) : (
              <div className="w-15 h-15 bg-orange-500 rounded flex items-center justify-center text-white flex-shrink-0">
                <span className="text-lg font-bold">r/</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {post.source.name}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </div>
              
              <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {post.title}
                </a>
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.description}
              </p>
              
              <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>💬 {post.content?.includes('Comments:') ? post.content.split('Comments: ')[1] : '0'}</span>
                <span className="mx-2">•</span>
                <span>⬆️ {post.content?.includes('Score:') ? post.content.split('Score: ')[1]?.split(' |')[0] : '0'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main component with Suspense
export default function RedditFeed({ query }: { query: string }) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-bold mb-4">Related Reddit Posts</h3>
      <Suspense fallback={<RedditLoading />}>
        <RedditFeedContent query={query} />
      </Suspense>
    </div>
  );
}