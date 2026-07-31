"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";

async function generateRiderCode() {
  const prefix = "LDK-R-";
  const count = await prisma.rider.count({
    where: { code: { startsWith: prefix } },
  });
  const baseSequence = count + 1;
  for (let i = 0; i < 10; i++) {
    const candidate = prefix + String(baseSequence + i).padStart(4, "0");
    const existing = await prisma.rider.findUnique({
      where: { code: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + random;
}

export async function createRider(formData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!name) return { ok: false, error: "Name is required." };
  if (!phone) return { ok: false, error: "Phone is required." };

  try {
    const code = await generateRiderCode();
    await prisma.rider.create({
      data: { code, name, phone, isActive: true },
    });
    revalidatePath("/admin/riders");
    return { ok: true };
  } catch (err) {
    console.error("[createRider] error:", err.message);
    return { ok: false, error: "Could not create the rider. Please try again." };
  }
}

export async function updateRider(riderId, formData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!name) return { ok: false, error: "Name is required." };
  if (!phone) return { ok: false, error: "Phone is required." };

  try {
    await prisma.rider.update({
      where: { id: riderId },
      data: { name, phone, isActive },
    });
    revalidatePath("/admin/riders");
    return { ok: true };
  } catch (err) {
    console.error("[updateRider] error:", err.message);
    return { ok: false, error: "Could not save the rider. Please try again." };
  }
}

export async function removeRider(riderId) {
  await requireAdmin();
  try {
    const orderCount = await prisma.order.count({ where: { riderId } });
    if (orderCount > 0) {
      return { ok: false, error: "This rider has past orders. Mark them inactive instead." };
    }
    await prisma.rider.delete({ where: { id: riderId } });
    revalidatePath("/admin/riders");
    return { ok: true };
  } catch (err) {
    console.error("[removeRider] error:", err.message);
    return { ok: false, error: "Could not remove the rider. Please try again." };
  }
}
