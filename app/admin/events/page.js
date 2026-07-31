import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import EventInquiryRow from "./EventInquiryRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Event inquiries — Admin" };

const FILTERS = [
  { value: "", label: "All" },
  { value: "NEW", label: "New" },
  { value: "QUOTED", label: "Quoted" },
  { value: "BOOKED", label: "Booked" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function EventsAdminPage({ searchParams }) {
  await requireAdmin();
  const filter = String(searchParams?.status || "");

  let inquiries = [];
  try {
    inquiries = await prisma.eventInquiry.findMany({
      where: filter ? { status: filter } : {},
      orderBy: [{ status: "asc" }, { eventDate: "asc" }],
    });
  } catch (err) {
    console.error("[EventsAdminPage] DB error:", err.message);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl mb-1">Event inquiries</h1>
        <p className="text-sm text-[#A69A88]">{inquiries.length} total</p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (filter || "") === f.value;
          const href = f.value ? `/admin/events?status=${f.value}` : "/admin/events";
          return (
            <Link key={f.value || "all"} href={href}
              className={`px-3 py-1.5 text-sm rounded-full ${active ? "bg-[#1A1614] text-white" : "bg-white border border-[#E8E2D5] hover:border-[#D4AF5A]"}`}>
              {f.label}
            </Link>
          );
        })}
      </nav>

      {inquiries.length === 0 ? (
        <p className="text-sm text-[#A69A88]">No inquiries match this filter.</p>
      ) : (
        <div className="space-y-2">
          {inquiries.map((i) => <EventInquiryRow key={i.id} inquiry={i} />)}
        </div>
      )}
    </div>
  );
}
