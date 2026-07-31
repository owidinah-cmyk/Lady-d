"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";

const STATUSES = ["NEW", "QUOTED", "BOOKED", "COMPLETED", "CANCELLED"];

export async function setEventStatus(inquiryId, newStatus) {
  await requireAdmin();
  if (!STATUSES.includes(newStatus)) return { ok: false, error: "Invalid status." };

  try {
    const inquiry = await prisma.eventInquiry.findUnique({
      where: { id: inquiryId },
      select: { id: true, status: true, eventDate: true, ref: true },
    });
    if (!inquiry) return { ok: false, error: "Inquiry not found." };

    await prisma.$transaction(async (tx) => {
      await tx.eventInquiry.update({
        where: { id: inquiryId },
        data: { status: newStatus },
      });

      if (newStatus === "BOOKED" && inquiry.status !== "BOOKED") {
        await tx.bookedDate.upsert({
          where: { date: inquiry.eventDate },
          update: { eventInquiryId: inquiry.id, label: inquiry.ref },
          create: { date: inquiry.eventDate, eventInquiryId: inquiry.id, label: inquiry.ref },
        });
      }
      if (inquiry.status === "BOOKED" && newStatus !== "BOOKED") {
        await tx.bookedDate.deleteMany({ where: { eventInquiryId: inquiry.id } });
      }
    });

    revalidatePath("/admin/events");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("[setEventStatus] error:", err.message);
    return { ok: false, error: "Could not update the inquiry. Please try again." };
  }
}
