// src/app/api/test-reddit/route.ts
import { NextResponse } from 'next/server';
import { fetchRedditPosts } from '@/app/services/redditService';

export async function GET() {
  console.log('🧪 Testing Reddit API endpoint...');
  
  try {
    // Test fetching a few posts from r/technology
    const posts = await fetchRedditPosts('technology', 5);
    
    console.log(`🧪 Test result: Got ${posts.length} posts`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully fetched ${posts.length} posts from r/technology`,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        source: post.source.name,
        score: post.content?.match(/Score: (\d+)/)?.[1] || 'unknown'
      })),
      sampleTitles: posts.slice(0, 3).map(p => p.title)
    });
  } catch (error) {
    console.error('🧪 Test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch Reddit posts'
    }, { status: 500 });
  }
}