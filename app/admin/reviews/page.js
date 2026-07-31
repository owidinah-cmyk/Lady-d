import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import ReviewRow from "./ReviewRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews — Admin" };

const FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default async function ReviewsAdminPage({ searchParams }) {
  await requireAdmin();
  const filter = String(searchParams?.status || "");

  let reviews = [];
  try {
    reviews = await prisma.review.findMany({
      where: filter ? { status: filter } : {},
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        customer: { select: { name: true } },
        order: { select: { ref: true } },
      },
    });
  } catch (err) {
    console.error("[ReviewsAdminPage] DB error:", err.message);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl mb-1">Reviews</h1>
        <p className="text-sm text-[#A69A88]">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (filter || "") === f.value;
          const href = f.value ? `/admin/reviews?status=${f.value}` : "/admin/reviews";
          return (
            <Link key={f.value || "all"} href={href}
              className={`px-3 py-1.5 text-sm rounded-full ${active ? "bg-[#1A1614] text-white" : "bg-white border border-[#E8E2D5] hover:border-[#D4AF5A]"}`}>
              {f.label}
            </Link>
          );
        })}
      </nav>

      {reviews.length === 0 ? (
        <p className="text-sm text-[#A69A88]">No reviews match this filter.</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => <ReviewRow key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}
