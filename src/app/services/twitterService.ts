// src/app/services/twitterService.ts

// Define tweet structure
export interface Tweet {
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

// Main function to fetch tweets by topic or search term
export async function fetchTweets(query: string): Promise<Tweet[]> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    console.error("No TWITTER_BEARER_TOKEN found in environment variables");
    return [];
  }

  // Encode query for URL
  const encodedQuery = encodeURIComponent(query);

  // Build the API URL for Twitter API v2 - recent search endpoint
  const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodedQuery}&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=name,profile_image_url,username`;

  try {
    // Server-side fetch with bearer token authentication
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      console.error(
        `Twitter API error: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    // Check if we have tweets
    if (!data.data || data.data.length === 0) {
      return [];
    }

    // Process tweets to include user information from includes
    const tweets: Tweet[] = data.data.map((tweet: any) => {
      // Find the author in the includes.users array
      const author = data.includes?.users?.find(
        (user: any) => user.id === tweet.author_id
      );

      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author_id: tweet.author_id,
        author_name: author?.name || "Unknown",
        author_username: author?.username || "unknown",
        author_profile_image: author?.profile_image_url || "",
        public_metrics: tweet.public_metrics || {
          retweet_count: 0,
          reply_count: 0,
          like_count: 0,
          quote_count: 0,
        },
      };
    });

    return tweets;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
}
