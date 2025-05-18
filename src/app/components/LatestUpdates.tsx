// Define the data structure
type UpdateData = {
  title: string;
  content: string;
  date: string;
};

// Mock function to simulate API call with proper return type
async function fetchLatestUpdate(): Promise<UpdateData> {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
  return {
    title: "Latest Updates",
    content:
      "Changes to this code will be deployed to Vercel when pushed to GitHub.",
    date: "May 18, 2025",
  };
}

export default async function LatestUpdates() {
  // Fetch data with type safety
  const update: UpdateData = await fetchLatestUpdate();

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{update.title}</h2>
      <p>{update.content}</p>
      <p className="text-sm mt-2">Published: {update.date}</p>
    </div>
  );
}
