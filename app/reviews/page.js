import { getApprovedReviews } from "@/lib/reviews/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Reviews — Lady D Kitchen",
  description: "What customers say about Lady D Kitchen Catering Services.",
};

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews({ limit: 100 });

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-serif text-4xl mb-2">Reviews</h1>
        <p className="text-muted mb-8">
          {reviews.length} review{reviews.length === 1 ? "" : "s"} from customers
        </p>

        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Check back soon.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="bg-white border border-hairline rounded-card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-clay text-sm">
                    {"★".repeat(r.rating)}
                    <span className="text-hairline">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </div>
                  <time className="text-xs text-muted">
                    {new Date(r.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                {r.comment && (
                  <p className="font-serif italic mb-3 leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                )}
                <p className="text-sm">
                  <strong>{r.customer?.name}</strong>
                </p>
                <p className="text-xs text-muted">
                  Order{" "}
                  <Link
                    href={`/account/orders/${r.order.ref}`}
                    className="hover:text-clay"
                  >
                    {r.order.ref}
                  </Link>
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
