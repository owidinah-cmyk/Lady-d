// Generates unique order reference numbers.
// Format: LDK-YYYY-NNNN where YYYY is the current year and
// NNNN is a 4-digit zero-padded sequence that resets each year.
// Includes a uniqueness loop in case of rare race conditions.

import { prisma } from "@/lib/db";

export async function generateOrderRef() {
  const year = new Date().getFullYear();
  const prefix = `LDK-${year}-`;

  // Count orders this calendar year to determine the next sequence.
  const startOfYear = new Date(year, 0, 1);
  const count = await prisma.order.count({
    where: { createdAt: { gte: startOfYear } },
  });
  const baseSequence = count + 1;

  // Try candidates in case the count is stale due to a race.
  for (let i = 0; i < 10; i++) {
    const candidate = prefix + String(baseSequence + i).padStart(4, "0");
    const existing = await prisma.order.findUnique({
      where: { ref: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }

  // Last-resort fallback: append a random suffix.
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + random;
}

export async function generateEventInquiryRef() {
  return generatePrefixedRef("LDK-EVT-");
}

export async function generateMerchInquiryRef() {
  return generatePrefixedRef("LDK-MRC-");
}

async function generatePrefixedRef(prefix) {
  const year = new Date().getFullYear();
  const fullPrefix = `${prefix}${year}-`;

  const count = await prisma.order.count({
    where: { ref: { startsWith: fullPrefix } },
  });
  const baseSequence = count + 1;

  for (let i = 0; i < 10; i++) {
    const candidate = fullPrefix + String(baseSequence + i).padStart(4, "0");
    const existing = await prisma.order.findUnique({
      where: { ref: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }

  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return fullPrefix + random;
}
