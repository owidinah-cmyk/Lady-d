import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import WeeklyScheduleForm from "./WeeklyScheduleForm";
import SpecialHoursList from "./SpecialHoursList";
import NewSpecialHoursForm from "./NewSpecialHoursForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Closing hours — Admin" };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default async function ClosingHoursPage() {
  await requireAdmin();

  let weekly = [];
  let special = [];
  try {
    [weekly, special] = await Promise.all([
      prisma.closingHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
      prisma.specialHours.findMany({ orderBy: { date: "asc" } }),
    ]);
  } catch (err) {
    console.error("[ClosingHoursPage] DB error:", err.message);
  }

  const weeklyByDay = Object.fromEntries(weekly.map((w) => [w.dayOfWeek, w]));
  const fullWeekly = Array.from({ length: 7 }, (_, i) => {
    const day = weeklyByDay[i] || { dayOfWeek: i, isClosed: i === 0, openTime: "09:00", closeTime: "20:00" };
    return { ...day, label: DAY_NAMES[i], key: DAY_KEYS[i] };
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="font-serif text-3xl mb-1">Closing hours</h1>
        <p className="text-sm text-[#A69A88]">
          Configure when the kitchen is open. The customer-side
          delivery-time picker uses these to block closed slots.
        </p>
      </header>

      <WeeklyScheduleForm weekly={fullWeekly} />
      <NewSpecialHoursForm />
      <SpecialHoursList items={special} />
    </div>
  );
}
