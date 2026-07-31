import Link from "next/link";

export const metadata = {
  title: "Not found — Lady D Kitchen",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream text-ink flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-serif text-6xl text-muted mb-4">404</p>
        <h1 className="font-serif text-3xl mb-3">Page not found</h1>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or
          may have moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-clay hover:bg-clay-dark text-white font-medium px-6 py-3 rounded-md transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
