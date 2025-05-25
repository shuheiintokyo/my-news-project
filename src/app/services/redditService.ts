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

// Helper function to transform Reddit data
function transformRedditData(data: RedditApiResponse): NewsArticle[] {
  if (!data.data?.children) {
    console.warn('⚠️ No children in Reddit API response');
    return [];
  }

  return data.data.children.map(child => {
    const post = child.data;
    
    // Get image URL from preview or thumbnail
    let imageUrl: string | undefined;
    if (post.preview?.images?.[0]?.source?.url) {
      imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
    } else if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && post.thumbnail !== 'nsfw') {
      imageUrl = post.thumbnail;
    }

    // Create description from selftext or use default
    const description = post.selftext 
      ? post.selftext.substring(0, 200) + (post.selftext.length > 200 ? '...' : '')
      : `Posted in r/${post.subreddit} by u/${post.author} • ${post.score} upvotes • ${post.num_comments} comments`;

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
}

// Fetch posts from a specific subreddit using public API
export async function fetchRedditPosts(subreddit: string, limit: number = 10): Promise<NewsArticle[]> {
  console.log(`🚀 Fetching Reddit posts from r/${subreddit} (limit: ${limit})`);
  
  try {
    // Use public Reddit API endpoint - no authentication required
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    console.log('📡 Making public Reddit API request:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'my-news-project/1.0.0 (https://github.com/shuheiintokyo/my-news-project)'
      },
      cache: 'no-store'
    });

    console.log('📡 Reddit API response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Reddit API error: ${response.status} ${response.statusText}`);
      console.error('Error body:', errorText);
      return [];
    }

    const data: RedditApiResponse = await response.json();
    console.log('📊 Reddit API data structure:', {
      hasData: !!data.data,
      hasChildren: !!data.data?.children,
      childrenCount: data.data?.children?.length || 0
    });
    
    if (!data.data?.children || data.data.children.length === 0) {
      console.warn(`⚠️ No posts found in r/${subreddit}`);
      return [];
    }

    const articles = transformRedditData(data);
    console.log(`✅ Successfully transformed ${articles.length} Reddit posts from r/${subreddit}`);
    console.log('Sample post titles:', articles.slice(0, 3).map(a => a.title));
    
    return articles;
  } catch (error) {
    console.error(`❌ Error fetching Reddit posts from r/${subreddit}:`, error);
    return [];
  }
}

// Fetch trending posts from multiple popular subreddits
export async function fetchTrendingRedditPosts(): Promise<NewsArticle[]> {
  console.log('🔥 Fetching trending Reddit posts from multiple subreddits...');
  const subreddits = ['technology', 'programming', 'worldnews', 'science'];
  const allPosts: NewsArticle[] = [];

  for (const subreddit of subreddits) {
    console.log(`📋 Fetching from r/${subreddit}...`);
    const posts = await fetchRedditPosts(subreddit, 3);
    console.log(`📋 Got ${posts.length} posts from r/${subreddit}`);
    allPosts.push(...posts);
  }

  console.log(`🔥 Total trending posts collected: ${allPosts.length}`);
  
  // Sort by score (parse from content) and return top posts
  const sortedPosts = allPosts.sort((a, b) => {
    const scoreA = parseInt(a.content?.match(/Score: (\d+)/)?.[1] || '0');
    const scoreB = parseInt(b.content?.match(/Score: (\d+)/)?.[1] || '0');
    return scoreB - scoreA;
  });
  
  const result = sortedPosts.slice(0, 10);
  console.log(`🔥 Returning top ${result.length} trending posts`);
  return result;
}

// Search Reddit posts by query using public search endpoint
export async function searchRedditPosts(query: string, limit: number = 10): Promise<NewsArticle[]> {
  console.log(`🔍 Searching Reddit for: "${query}" (limit: ${limit})`);
  
  try {
    // Use public Reddit search endpoint
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.reddit.com/search.json?q=${encodedQuery}&limit=${limit}&sort=relevance&t=week`;
    console.log('📡 Making public Reddit search request:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'my-news-project/1.0.0 (https://github.com/shuheiintokyo/my-news-project)'
      },
      cache: 'no-store'
    });

    console.log('📡 Reddit search response:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Reddit search error: ${response.status} ${response.statusText}`);
      console.error('Error body:', errorText);
      return [];
    }

    const data: RedditApiResponse = await response.json();
    console.log('📊 Reddit search data:', {
      hasData: !!data.data,
      hasChildren: !!data.data?.children,
      childrenCount: data.data?.children?.length || 0
    });
    
    if (!data.data?.children || data.data.children.length === 0) {
      console.warn(`⚠️ No search results found for "${query}"`);
      return [];
    }

    const articles = transformRedditData(data);
    console.log(`✅ Successfully found ${articles.length} Reddit posts for "${query}"`);
    
    return articles;
  } catch (error) {
    console.error(`❌ Error searching Reddit posts for "${query}":`, error);
    return [];
  }
}