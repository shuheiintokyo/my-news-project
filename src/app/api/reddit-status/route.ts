// src/app/api/reddit-status/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔍 Testing Reddit API connectivity...');
  
  const testUrls = [
    'https://www.reddit.com/r/technology/hot.json?limit=1',
    'https://www.reddit.com/r/programming/hot.json?limit=1',
    'https://www.reddit.com/.json?limit=1'
  ];

  const results = [];

  for (const url of testUrls) {
    try {
      console.log(`🧪 Testing: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'my-news-project/1.0.0 (https://github.com/shuheiintokyo/my-news-project)'
        },
        cache: 'no-store'
      });

      console.log(`📡 Response for ${url}:`, response.status, response.statusText);

      const isSuccess = response.ok;
      let data = null;
      let error = null;

      if (isSuccess) {
        try {
          data = await response.json();
          console.log(`✅ Successfully fetched data from ${url}:`, {
            hasData: !!data.data,
            hasChildren: !!data.data?.children,
            childrenCount: data.data?.children?.length || 0
          });
        } catch (parseError) {
          console.error(`❌ JSON parse error for ${url}:`, parseError);
          error = 'JSON parse failed';
        }
      } else {
        error = await response.text();
        console.error(`❌ Failed to fetch ${url}:`, response.status, error);
      }

      results.push({
        url,
        status: response.status,
        statusText: response.statusText,
        success: isSuccess,
        hasData: !!data?.data,
        childrenCount: data?.data?.children?.length || 0,
        error: error || undefined,
        sampleTitle: data?.data?.children?.[0]?.data?.title || undefined
      });

    } catch (fetchError) {
      console.error(`❌ Network error for ${url}:`, fetchError);
      results.push({
        url,
        status: 0,
        statusText: 'Network Error',
        success: false,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown network error'
      });
    }
  }

  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    successfulTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    results
  };

  console.log('📊 Reddit API test summary:', summary);

  return NextResponse.json(summary);
}