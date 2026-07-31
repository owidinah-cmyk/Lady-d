import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "DB Health — Dev" };

export default async function DbHealthPage() {
  const isProd =
    process.env.NODE_ENV === "production" ||
    (process.env.NEXT_PUBLIC_SITE_URL || "").includes("vercel.app");
  if (isProd) notFound();

  let result = { ok: false, error: null, counts: null };
  try {
    const [dishes, zones, hours, riders, variants, admin] = await Promise.all([
      prisma.dish.count(),
      prisma.zone.count(),
      prisma.closingHours.count(),
      prisma.rider.count(),
      prisma.variant.count(),
      prisma.adminUser.count(),
    ]);
    result = { ok: true, error: null, counts: { dishes, variants, zones, riders, hours, admin } };
  } catch (err) {
    result = { ok: false, error: err.message, counts: null };
  }

  return (
    <main className="min-h-screen bg-cream text-ink p-12">
      <h1 className="font-serif text-3xl mb-6">DB Health (dev only)</h1>
      <div className="bg-white border border-hairline rounded-card p-6 max-w-xl">
        <p className="mb-2">
          Status:{" "}
          <span className={result.ok ? "text-success-text" : "text-terracotta"}>
            {result.ok ? "✓ Connected" : "✗ Error"}
          </span>
        </p>
        {result.counts && (
          <pre className="text-sm text-muted mt-4">
            {JSON.stringify(result.counts, null, 2)}
          </pre>
        )}
        {result.error && <p className="text-sm text-terracotta mt-4">{result.error}</p>}
      </div>
    </main>
  );
}
