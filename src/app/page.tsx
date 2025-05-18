import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">My News Project</h1>
        <p className="text-xl">Your source for the latest news</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Featured Story</h2>
            <p>
              This Next.js project has been successfully connected to GitHub and
              Vercel!
            </p>
            <p className="text-sm mt-2">Published: May 18, 2025</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Latest Updates</h2>
            <p>
              Changes to this code will be deployed to Vercel when pushed to
              GitHub.
            </p>
            <p className="text-sm mt-2">Published: May 18, 2025</p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm">
        <p>© 2025 My News Project - Built with Next.js</p>
      </footer>
    </div>
  );
}
