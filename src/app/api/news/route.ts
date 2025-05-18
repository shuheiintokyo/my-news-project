// src/app/api/news/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'technology';
  
  const apiKey = process.env.NEWS_API_KEY; // No NEXT_PUBLIC_ prefix here
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'ok') {
      return NextResponse.json({ error: data.message || 'Unknown error' }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}