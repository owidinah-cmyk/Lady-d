import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { formatPrice } from "@/lib/menu/dishes";
import ZoneRow from "./ZoneRow";
import NewZoneForm from "./NewZoneForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Zones — Admin" };

export default async function ZonesAdminPage() {
  await requireAdmin();

  let zones = [];
  try {
    zones = await prisma.zone.findMany({
      orderBy: [{ city: "asc" }, { name: "asc" }],
    });
  } catch (err) {
    console.error("[ZonesAdminPage] DB error:", err.message);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl mb-1">Delivery zones</h1>
        <p className="text-sm text-[#A69A88]">
          {zones.length} zone{zones.length === 1 ? "" : "s"} configured
        </p>
      </header>

      <NewZoneForm />

      {zones.length === 0 ? (
        <p className="text-sm text-[#A69A88]">No zones yet. Add one above.</p>
      ) : (
        <div className="bg-white border border-[#E8E2D5] rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F5F1] text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">City</th>
                <th className="px-4 py-2 font-medium">Fee</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <ZoneRow key={z.id} zone={z} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
