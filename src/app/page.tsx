import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">My News Project</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Your source for the latest news</p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Featured News Item */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Featured Story</h2>
            <p className="mb-4">This Next.js project has been successfully connected to GitHub and Vercel for continuous deployment!</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Published: May 18, 2025</p>
          </div>
          
          {/* Secondary News Item */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Latest Updates</h2>
            <p className="mb-4">Any changes you make to this code will automatically be deployed to Vercel when pushed to GitHub.</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Published: May 18, 2025</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="mb-6">This is a modified version of the starter template to verify GitHub and Vercel integration.</p>
          
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 mx-auto inline-flex"
            href="https://github.com/shuheiintokyo/my-news-project"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </main>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© 2025 My News Project - Built with Next.js and deployed on Vercel</p>
      </footer>
    </div>
  );
}