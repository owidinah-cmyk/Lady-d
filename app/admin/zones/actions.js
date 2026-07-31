"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";

async function generateZoneCode(city) {
  const cityCode = city === "Abuja" ? "ABJ" : "PH";
  const prefix = `LDK-Z-${cityCode}-`;
  const count = await prisma.zone.count({
    where: { code: { startsWith: prefix } },
  });
  const baseSequence = count + 1;
  for (let i = 0; i < 10; i++) {
    const candidate = prefix + String(baseSequence + i).padStart(4, "0");
    const existing = await prisma.zone.findUnique({
      where: { code: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + random;
}

export async function createZone(formData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const deliveryFeeNaira = Number(formData.get("deliveryFee") || 0);

  if (!name) return { ok: false, error: "Name is required." };
  if (city !== "Abuja" && city !== "Port Harcourt") {
    return { ok: false, error: "City must be Abuja or Port Harcourt." };
  }
  if (!Number.isFinite(deliveryFeeNaira) || deliveryFeeNaira < 0) {
    return { ok: false, error: "Delivery fee must be a non-negative number." };
  }

  try {
    const code = await generateZoneCode(city);
    await prisma.zone.create({
      data: {
        code,
        name,
        city,
        deliveryFee: Math.round(deliveryFeeNaira),
        isActive: true,
      },
    });
    revalidatePath("/admin/zones");
    revalidatePath("/menu");
    revalidatePath("/order");
    revalidatePath("/checkout");
    return { ok: true };
  } catch (err) {
    console.error("[createZone] error:", err.message);
    return { ok: false, error: "Could not create the zone. Please try again." };
  }
}

export async function updateZone(zoneId, formData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const deliveryFeeNaira = Number(formData.get("deliveryFee") || 0);
  const isActive = formData.get("isActive") === "on";

  if (!name) return { ok: false, error: "Name is required." };
  if (!Number.isFinite(deliveryFeeNaira) || deliveryFeeNaira < 0) {
    return { ok: false, error: "Delivery fee must be a non-negative number." };
  }

  try {
    await prisma.zone.update({
      where: { id: zoneId },
      data: {
        name,
        deliveryFee: Math.round(deliveryFeeNaira),
        isActive,
      },
    });
    revalidatePath("/admin/zones");
    revalidatePath("/menu");
    revalidatePath("/order");
    revalidatePath("/checkout");
    return { ok: true };
  } catch (err) {
    console.error("[updateZone] error:", err.message);
    return { ok: false, error: "Could not save the zone. Please try again." };
  }
}

export async function removeZone(zoneId) {
  await requireAdmin();
  try {
    const orderCount = await prisma.order.count({ where: { zoneId } });
    if (orderCount > 0) {
      return { ok: false, error: "This zone has past orders. Mark it inactive instead." };
    }
    await prisma.zone.delete({ where: { id: zoneId } });
    revalidatePath("/admin/zones");
    return { ok: true };
  } catch (err) {
    console.error("[removeZone] error:", err.message);
    return { ok: false, error: "Could not remove the zone. Please try again." };
  }
}
