// src/app/news-modal/[id]/page.tsx
import { fetchTopHeadlines } from "@/app/services/newsService";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    // Simple implementation to test if it works
    const articles = await fetchTopHeadlines();
    const article = articles.find(a => a.id === id);
    
    if (!article) {
      return <div>Article not found</div>;
    }
    
    return (
      <div>
        <h1>{article.title}</h1>
        <p>{article.content}</p>
      </div>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    return <div>Error loading article</div>;
  }
}
