import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import RiderRow from "./RiderRow";
import NewRiderForm from "./NewRiderForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Riders — Admin" };

export default async function RidersAdminPage() {
  await requireAdmin();

  let riders = [];
  try {
    riders = await prisma.rider.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    });
  } catch (err) {
    console.error("[RidersAdminPage] DB error:", err.message);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl mb-1">Riders</h1>
        <p className="text-sm text-[#A69A88]">
          {riders.length} rider{riders.length === 1 ? "" : "s"}
        </p>
      </header>

      <NewRiderForm />

      {riders.length === 0 ? (
        <p className="text-sm text-[#A69A88]">No riders yet. Add one above.</p>
      ) : (
        <div className="bg-white border border-[#E8E2D5] rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F5F1] text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Phone</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {riders.map((r) => (
                <RiderRow key={r.id} rider={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
