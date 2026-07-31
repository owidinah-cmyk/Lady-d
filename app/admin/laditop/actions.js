"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";

const STATUSES = ["NEW", "QUOTED", "CONFIRMED", "COMPLETED", "CANCELLED"];

export async function setMerchStatus(inquiryId, newStatus) {
  await requireAdmin();
  if (!STATUSES.includes(newStatus)) return { ok: false, error: "Invalid status." };
  try {
    await prisma.merchInquiry.update({
      where: { id: inquiryId },
      data: { status: newStatus },
    });
    revalidatePath("/admin/laditop");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("[setMerchStatus] error:", err.message);
    return { ok: false, error: "Could not update the inquiry. Please try again." };
  }
}
