// src/app/components/TwitterFeed.tsx
import Image from "next/image";
import { Suspense } from "react";

// Define the Tweet interface
interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  author_name?: string;
  author_username?: string;
  author_profile_image?: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

// Temporary mock function until we create the real service
async function fetchTweets(query: string): Promise<Tweet[]> {
  // Return empty array for now
  return [];
}

// Loading skeleton component
function TwitterLoading() {
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

// Twitter feed content component
async function TwitterFeedContent({ query }: { query: string }) {
  const tweets = await fetchTweets(query);

  if (tweets.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
        <p>No relevant tweets found for this topic.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
        >
          <div className="flex items-center mb-2">
            {tweet.author_profile_image ? (
              <Image
                src={tweet.author_profile_image}
                alt={tweet.author_name || "Twitter user"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
                {tweet.author_name?.charAt(0) || "?"}
              </div>
            )}
            <div className="ml-3">
              <p className="font-bold">{tweet.author_name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{tweet.author_username}
              </p>
            </div>
          </div>

          <p className="mb-2">{tweet.text}</p>

          <div className="flex text-sm text-gray-600 dark:text-gray-400 mt-2 justify-between">
            <span>{new Date(tweet.created_at).toLocaleString()}</span>
            <div className="flex space-x-4">
              <span>♥ {tweet.public_metrics?.like_count || 0}</span>
              <span>↻ {tweet.public_metrics?.retweet_count || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main component with Suspense
export default function TwitterFeed({ query }: { query: string }) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-bold mb-4">Related Tweets</h3>
      <Suspense fallback={<TwitterLoading />}>
        <TwitterFeedContent query={query} />
      </Suspense>
    </div>
  );
}
