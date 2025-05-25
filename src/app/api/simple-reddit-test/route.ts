// src/app/api/simple-reddit-test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🧪 Simple Reddit test starting...');
  
  try {
    // Direct fetch to Reddit public API - no imports, no complexity
    const url = 'https://www.reddit.com/r/technology/hot.json?limit=3';
    console.log('📡 Fetching:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'my-news-project/1.0.0'
      }
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fetch failed:', response.status, response.statusText);
      console.error('❌ Error body:', errorText);
      
      return NextResponse.json({
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('📊 Data structure:', {
      hasData: !!data.data,
      hasChildren: !!data.data?.children,
      childrenCount: data.data?.children?.length || 0
    });

    if (!data.data?.children) {
      return NextResponse.json({
        success: false,
        message: 'No data.children in response',
        response: data
      });
    }

    const posts = data.data.children.map((child: { data: { id: string; title: string; score: number; subreddit: string; author: string } }) => ({
      id: child.data.id,
      title: child.data.title,
      score: child.data.score,
      subreddit: child.data.subreddit,
      author: child.data.author
    }));

    console.log('✅ Successfully parsed', posts.length, 'posts');
    
    return NextResponse.json({
      success: true,
      message: `Successfully fetched ${posts.length} posts from r/technology`,
      posts,
      rawDataStructure: {
        hasData: !!data.data,
        hasChildren: !!data.data?.children,
        childrenCount: data.data?.children?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}