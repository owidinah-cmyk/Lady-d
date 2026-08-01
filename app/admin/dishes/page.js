// /app/admin/dishes/page.js
// Lists all dishes with their variants count, status, and a
// link to edit. Also a primary CTA at the top to add a new dish.

import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { formatPrice } from "@/lib/menu/dishes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dishes — Admin",
};

export default async function DishesAdminPage() {
  await requireAdmin();

  let dishes = [];
  try {
    dishes = await prisma.dish.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
      include: {
        variants: {
          orderBy: { price: "asc" },
          select: { id: true, code: true, size: true, price: true, isActive: true },
        },
      },
    });
  } catch (err) {
    console.error("[DishesAdminPage] DB error:", err.message);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-1">Dishes</h1>
          <p className="text-sm text-[#A69A88]">
            {dishes.length} dish{dishes.length === 1 ? "" : "es"} in catalog
          </p>
        </div>
        <Link
          href="/admin/dishes/new"
          className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium px-4 py-2 rounded-md transition-colors text-sm"
        >
          + Add dish
        </Link>
      </header>

      {dishes.length === 0 ? (
        <div className="bg-white border border-[#E8E2D5] rounded-card p-8 text-center">
          <p className="text-[#A69A88] mb-4">No dishes yet.</p>
          <Link
            href="/admin/dishes/new"
            className="inline-block bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium px-5 py-2 rounded-md transition-colors"
          >
            Add your first dish
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
        <div className="bg-white border border-[#E8E2D5] rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F5F1] text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Variants</th>
                <th className="px-4 py-2 font-medium">From</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => {
                const minPrice = dish.variants[0]?.price || 0;
                const activeVariants = dish.variants.filter((v) => v.isActive).length;
                return (
                  <tr key={dish.id} className="border-t border-[#E8E2D5]">
                    <td className="px-4 py-2 font-mono text-xs">{dish.code}</td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{dish.name}</div>
                      {dish.isFeatured && (
                        <span className="text-[10px] uppercase tracking-wide bg-[#D4AF5A] text-white px-1.5 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-[#A69A88]">{dish.category}</td>
                    <td className="px-4 py-2 text-[#A69A88]">
                      {activeVariants} active
                    </td>
                    <td className="px-4 py-2">{formatPrice(minPrice)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          dish.isActive
                            ? "bg-[#D4AF5A] text-white"
                            : "bg-[#F7F5F1] text-[#A69A88]"
                        }`}
                      >
                        {dish.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/dishes/${dish.id}`}
                        className="text-[#D4AF5A] hover:underline"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          </div>
          )}
    </div>
  );
}
