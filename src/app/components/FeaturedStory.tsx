// Define the data structure
type StoryData = {
  title: string;
  content: string;
  date: string;
};

// Mock function to simulate API call with proper return type
async function fetchFeaturedStory(): Promise<StoryData> {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  return {
    title: "Featured Story",
    content:
      "This Next.js project has been successfully connected to GitHub and Vercel!",
    date: "May 18, 2025",
  };
}

export default async function FeaturedStory() {
  // Fetch data with type safety
  const story: StoryData = await fetchFeaturedStory();

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
      <p>{story.content}</p>
      <p className="text-sm mt-2">Published: {story.date}</p>
    </div>
  );
}
