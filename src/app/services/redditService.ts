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
function transformRedditData(data: RedditApiResponse, subreddit: string): NewsArticle[] {
  if (!data.data?.children) {
    return [];
  }

  return data.data.children.map(child => {
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
}

// Get Reddit access token using client credentials
async function getRedditAccessToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  console.log('🔍 Reddit Auth Debug:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId?.length,
    clientSecretLength: clientSecret?.length
  });

  if (!clientId || !clientSecret) {
    console.error("❌ Reddit credentials not found in environment variables");
    console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('REDDIT')));
    return null;
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    console.log('🔑 Making Reddit auth request with basic auth...');
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'my-news-project/1.0.0'
      },
      body: 'grant_type=client_credentials',
    });

    console.log('📡 Reddit auth response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Reddit auth error: ${response.status} ${response.statusText}`);
      console.error('Error body:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('✅ Reddit auth success:', {
      hasAccessToken: !!data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in
    });
    
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting Reddit access token:', error);
    return null;
  }
}

// Fetch posts from a specific subreddit
export async function fetchRedditPosts(subreddit: string, limit: number = 10): Promise<NewsArticle[]> {
  console.log(`🚀 Fetching Reddit posts from r/${subreddit} (limit: ${limit})`);
  
  try {
    // Try without authentication first (public endpoint)
    const publicUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    console.log('📡 Trying public Reddit API first:', publicUrl);
    
    const publicResponse = await fetch(publicUrl, {
      headers: {
        'User-Agent': 'my-news-project/1.0.0'
      },
      cache: 'no-store'
    });

    console.log('📡 Public Reddit API response:', {
      status: publicResponse.status,
      statusText: publicResponse.statusText
    });

    if (publicResponse.ok) {
      const publicData: RedditApiResponse = await publicResponse.json();
      console.log('📊 Public Reddit API data structure:', {
        hasData: !!publicData.data,
        hasChildren: !!publicData.data?.children,
        childrenCount: publicData.data?.children?.length || 0
      });

      if (publicData.data?.children?.length > 0) {
        console.log('✅ Using public Reddit API (no auth needed)');
        const articles = transformRedditData(publicData, subreddit);
        console.log(`✅ Successfully transformed ${articles.length} Reddit posts from r/${subreddit}`);
        return articles;
      }
    }

    // Fall back to OAuth if public doesn't work
    console.log('🔄 Falling back to OAuth Reddit API...');
    const accessToken = await getRedditAccessToken();
    
    if (!accessToken) {
      console.error("❌ No access token available for Reddit API");
      return [];
    }

    const url = `https://oauth.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    console.log('📡 Making OAuth Reddit API request:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'my-news-project/1.0.0'
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
    console.log('📊 OAuth Reddit API data structure:', {
      hasData: !!data.data,
      hasChildren: !!data.data?.children,
      childrenCount: data.data?.children?.length || 0
    });
    
    if (!data.data?.children) {
      console.warn('⚠️ No children in OAuth Reddit API response');
      return [];
    }

    const articles = transformRedditData(data, subreddit);
    console.log(`✅ Successfully transformed ${articles.length} Reddit posts from r/${subreddit} via OAuth`);
    console.log('Sample post titles:', articles.slice(0, 3).map(a => a.title));
    
    return articles;
  } catch (error) {
    console.error(`❌ Error fetching Reddit posts from r/${subreddit}:`, error);
    return [];
  }
}

// Fetch trending posts from multiple subreddits
export async function fetchTrendingRedditPosts(): Promise<NewsArticle[]> {
  console.log('🔥 Fetching trending Reddit posts from multiple subreddits...');
  const subreddits = ['technology', 'programming', 'news', 'worldnews'];
  const allPosts: NewsArticle[] = [];

  for (const subreddit of subreddits) {
    console.log(`📋 Fetching from r/${subreddit}...`);
    const posts = await fetchRedditPosts(subreddit, 3);
    console.log(`📋 Got ${posts.length} posts from r/${subreddit}`);
    allPosts.push(...posts);
  }

  console.log(`🔥 Total trending posts collected: ${allPosts.length}`);
  // Sort by score (extracted from content) and return top posts
  const result = allPosts.slice(0, 10);
  console.log(`🔥 Returning top ${result.length} trending posts`);
  return result;
}

// Search Reddit posts by query
export async function searchRedditPosts(query: string, limit: number = 10): Promise<NewsArticle[]> {
  console.log(`🔍 Searching Reddit for: "${query}" (limit: ${limit})`);
  
  try {
    // Try public search first
    const encodedQuery = encodeURIComponent(query);
    const publicUrl = `https://www.reddit.com/search.json?q=${encodedQuery}&limit=${limit}&sort=relevance`;
    console.log('📡 Trying public Reddit search:', publicUrl);
    
    const publicResponse = await fetch(publicUrl, {
      headers: {
        'User-Agent': 'my-news-project/1.0.0'
      },
      cache: 'no-store'
    });

    console.log('📡 Public Reddit search response:', {
      status: publicResponse.status,
      statusText: publicResponse.statusText
    });

    if (publicResponse.ok) {
      const publicData: RedditApiResponse = await publicResponse.json();
      console.log('📊 Public Reddit search data:', {
        hasData: !!publicData.data,
        hasChildren: !!publicData.data?.children,
        childrenCount: publicData.data?.children?.length || 0
      });

      if (publicData.data?.children?.length > 0) {
        console.log('✅ Using public Reddit search (no auth needed)');
        const articles = transformRedditData(publicData, 'search');
        console.log(`✅ Successfully found ${articles.length} Reddit posts for "${query}"`);
        return articles;
      }
    }

    // Fall back to OAuth search
    console.log('🔄 Falling back to OAuth Reddit search...');
    const accessToken = await getRedditAccessToken();
    
    if (!accessToken) {
      console.error("❌ No access token available for Reddit search");
      return [];
    }

    const url = `https://oauth.reddit.com/search.json?q=${encodedQuery}&limit=${limit}&sort=relevance`;
    console.log('📡 Making OAuth Reddit search request:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'my-news-project/1.0.0'
      },
      cache: 'no-store'
    });

    console.log('📡 OAuth Reddit search response:', {
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
    console.log('📊 OAuth Reddit search data:', {
      hasData: !!data.data,
      hasChildren: !!data.data?.children,
      childrenCount: data.data?.children?.length || 0
    });
    
    if (!data.data?.children) {
      console.warn('⚠️ No children in OAuth Reddit search response');
      return [];
    }

    const articles = transformRedditData(data, 'search');
    console.log(`✅ Successfully found ${articles.length} Reddit posts for "${query}" via OAuth`);
    
    return articles;
  } catch (error) {
    console.error(`❌ Error searching Reddit posts for "${query}":`, error);
    return [];
  }
}