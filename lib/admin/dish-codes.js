// Generates unique dish codes (LDK-D-NNNN) and variant codes
// (LDK-V-NNNN). 4-digit zero-padded sequence, no year (dishes
// and variants don't reset yearly — they accumulate forever).

import { prisma } from "@/lib/db";

export async function generateDishCode() {
  return generateCode("Dish", "D");
}

export async function generateVariantCode() {
  return generateCode("Variant", "V");
}

async function generateCode(model, letter) {
  const prefix = `LDK-${letter}-`;
  // Count existing rows with codes starting with the prefix.
  // Cheap and accurate for low-volume admin operations.
  const count = await prisma[model.toLowerCase()].count({
    where: { code: { startsWith: prefix } },
  });
  const baseSequence = count + 1;
  for (let i = 0; i < 10; i++) {
    const candidate = prefix + String(baseSequence + i).padStart(4, "0");
    const existing = await prisma[model.toLowerCase()].findUnique({
      where: { code: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + random;
}
