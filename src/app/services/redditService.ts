// src/app/services/redditService.ts

// Define Reddit post structure
export interface RedditPost {
  id: string;
  title: string;
  url: string;
  author: string;
  created_utc: number;
  score: number;
  num_comments: number;
  subreddit: string;
  selftext: string;
  thumbnail?: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
    }>;
  };
}

// Transform Reddit post to NewsArticle format
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
}

// Reddit API response types
interface RedditApiResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

// Get Reddit access token using client credentials
async function getRedditAccessToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Reddit credentials not found in environment variables");
    return null;
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'my-news-project/1.0.0'
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      console.error(`Reddit auth error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Reddit access token:', error);
    return null;
  }
}

// Fetch posts from a specific subreddit
export async function fetchRedditPosts(subreddit: string, limit: number = 10): Promise<NewsArticle[]> {
  try {
    const accessToken = await getRedditAccessToken();
    
    if (!accessToken) {
      return [];
    }

    const url = `https://oauth.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'my-news-project/1.0.0'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: RedditApiResponse = await response.json();
    
    if (!data.data?.children) {
      return [];
    }

    // Transform Reddit posts to NewsArticle format
    const articles: NewsArticle[] = data.data.children.map(child => {
      const post = child.data;
      
      // Get image URL from preview or thumbnail
      let imageUrl: string | undefined;
      if (post.preview?.images?.[0]?.source?.url) {
        imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
      } else if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
        imageUrl = post.thumbnail;
      }

      // Create description from selftext or use title
      const description = post.selftext 
        ? post.selftext.substring(0, 200) + (post.selftext.length > 200 ? '...' : '')
        : `Posted in r/${post.subreddit} by u/${post.author}`;

      return {
        id: `reddit-${post.id}`,
        title: post.title,
        description,
        url: post.url.startsWith('http') ? post.url : `https://reddit.com${post.url}`,
        urlToImage: imageUrl,
        publishedAt: new Date(post.created_utc * 1000).toISOString(),
        source: {
          name: `r/${post.subreddit}`
        },
        content: post.selftext || `Score: ${post.score} | Comments: ${post.num_comments}`
      };
    });

    return articles;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
}

// Fetch trending posts from multiple subreddits
export async function fetchTrendingRedditPosts(): Promise<NewsArticle[]> {
  const subreddits = ['technology', 'programming', 'news', 'worldnews'];
  const allPosts: NewsArticle[] = [];

  for (const subreddit of subreddits) {
    const posts = await fetchRedditPosts(subreddit, 3);
    allPosts.push(...posts);
  }

  // Sort by score (extracted from content) and return top posts
  return allPosts.slice(0, 10);
}

// Search Reddit posts by query
export async function searchRedditPosts(query: string, limit: number = 10): Promise<NewsArticle[]> {
  try {
    const accessToken = await getRedditAccessToken();
    
    if (!accessToken) {
      return [];
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://oauth.reddit.com/search.json?q=${encodedQuery}&limit=${limit}&sort=relevance`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'my-news-project/1.0.0'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Reddit search error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: RedditApiResponse = await response.json();
    
    if (!data.data?.children) {
      return [];
    }

    // Transform Reddit posts to NewsArticle format
    const articles: NewsArticle[] = data.data.children.map(child => {
      const post = child.data;
      
      // Get image URL from preview or thumbnail
      let imageUrl: string | undefined;
      if (post.preview?.images?.[0]?.source?.url) {
        imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
      } else if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
        imageUrl = post.thumbnail;
      }

      // Create description from selftext or use title
      const description = post.selftext 
        ? post.selftext.substring(0, 200) + (post.selftext.length > 200 ? '...' : '')
        : `Posted in r/${post.subreddit} by u/${post.author}`;

      return {
        id: `reddit-search-${post.id}`,
        title: post.title,
        description,
        url: post.url.startsWith('http') ? post.url : `https://reddit.com${post.url}`,
        urlToImage: imageUrl,
        publishedAt: new Date(post.created_utc * 1000).toISOString(),
        source: {
          name: `r/${post.subreddit}`
        },
        content: post.selftext || `Score: ${post.score} | Comments: ${post.num_comments}`
      };
    });

    return articles;
  } catch (error) {
    console.error('Error searching Reddit posts:', error);
    return [];
  }
}