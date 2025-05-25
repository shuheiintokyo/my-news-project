# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server (http://localhost:3000)
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 news aggregation application that fetches content from multiple sources and displays them in a unified interface.

### Core Architecture

**App Router Structure**: Uses Next.js App Router with server components for data fetching
- Main page (`src/app/page.tsx`) renders multiple news sections using React Suspense
- Each news section is a server component that fetches data independently
- Dynamic rendering is enforced with `export const dynamic = "force-dynamic"`

**News Services Layer** (`src/app/services/`):
- `newsService.ts` - Fetches from NewsAPI (requires NEWS_API_KEY)
- `guardianService.ts` - Fetches from The Guardian API (requires GUARDIAN_API_KEY) 
- `redditService.ts` - Fetches from Reddit public API (no authentication required)

All services transform external API responses into a common `NewsArticle` interface for consistency.

**Component Structure**:
- `NewsCard.tsx` - Reusable card component for displaying articles
- Links to modal pages (`/news-modal/[id]`) for article details
- Uses Next.js Image component for optimized image loading

**Data Flow**:
1. Server components call service functions during render
2. Services make external API calls with server-side environment variables
3. Responses are transformed to common `NewsArticle` format
4. Components render with Suspense fallbacks for loading states

### Environment Variables Required

- `NEWS_API_KEY` - NewsAPI key for technology/business/health news
- `GUARDIAN_API_KEY` - The Guardian API key

### Key Technical Details

- Uses Tailwind CSS for styling with dark mode support
- All external API calls are server-side only (no client-side keys)
- Article IDs are generated deterministically for consistent linking
- Error handling returns empty arrays to gracefully handle API failures