// Server Actions for dish management. createDish creates a dish
// + its initial variant (one variant is required so the dish
// is immediately orderable). Variants beyond the first are
// added via the edit page (5.2b).

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { generateDishCode, generateVariantCode } from "@/lib/admin/dish-codes";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createDish(formData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { ok: false, error: "Name is required." };
  }

  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  if (!category) {
    return { ok: false, error: "Category is required." };
  }

  const leadTimeHours = Number(formData.get("leadTimeHours") || 24);
  if (!Number.isInteger(leadTimeHours) || leadTimeHours < 0) {
    return { ok: false, error: "Lead time must be a non-negative integer." };
  }

  const minOrder = Number(formData.get("minOrder") || 1);
  if (!Number.isInteger(minOrder) || minOrder < 1) {
    return { ok: false, error: "Min order must be a positive integer." };
  }

  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const abujaAvailable = formData.get("abujaAvailable") === "on";
  const phAvailable = formData.get("phAvailable") === "on";

  // First variant: required so the dish is orderable.
  const variantSize = String(formData.get("variantSize") || "").trim();
  const variantPriceKobo = Number(formData.get("variantPrice") || 0);
  if (!variantSize) {
    return { ok: false, error: "The first variant size is required." };
  }
  if (!Number.isFinite(variantPriceKobo) || variantPriceKobo < 0) {
    return { ok: false, error: "The first variant price is required." };
  }

  // Generate codes and slug.
  const code = await generateDishCode();
  const variantCode = await generateVariantCode();

  // Slug — make it unique.
  let slug = slugify(name);
  const existing = await prisma.dish.findUnique({ where: { slug }, select: { id: true } });
  if (existing) {
    slug = `${slug}-${code.toLowerCase().replace("ldk-d-", "")}`;
  }

  try {
    const dish = await prisma.dish.create({
      data: {
        code,
        name,
        slug,
        description,
        category,
        photos: [],
        leadTimeHours,
        minOrder,
        isActive,
        isFeatured,
        abujaAvailable,
        phAvailable,
        variants: {
          create: [{
            code: variantCode,
            size: variantSize,
            price: Math.round(variantPriceKobo),
            isActive: true,
          }],
        },
      },
    });
    revalidatePath("/admin/dishes");
    revalidatePath("/");
    revalidatePath("/menu");
    return { ok: true, id: dish.id };
  } catch (err) {
    console.error("[createDish] error:", err.message);
    return { ok: false, error: "Could not create the dish. Please try again." };
  }
}

// ---- updateDish ----
export async function updateDish(dishId, formData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) return { ok: false, error: "Name is required." };

  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  if (!category) return { ok: false, error: "Category is required." };

  const leadTimeHours = Number(formData.get("leadTimeHours") || 24);
  if (!Number.isInteger(leadTimeHours) || leadTimeHours < 0) {
    return { ok: false, error: "Lead time must be a non-negative integer." };
  }
  const minOrder = Number(formData.get("minOrder") || 1);
  if (!Number.isInteger(minOrder) || minOrder < 1) {
    return { ok: false, error: "Min order must be a positive integer." };
  }

  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const abujaAvailable = formData.get("abujaAvailable") === "on";
  const phAvailable = formData.get("phAvailable") === "on";

  try {
    await prisma.dish.update({
      where: { id: dishId },
      data: {
        name,
        description,
        category,
        leadTimeHours,
        minOrder,
        isActive,
        isFeatured,
        abujaAvailable,
        phAvailable,
      },
    });
    revalidatePath("/admin/dishes");
    revalidatePath("/admin/dishes/" + dishId);
    revalidatePath("/");
    revalidatePath("/menu");
    return { ok: true };
  } catch (err) {
    console.error("[updateDish] error:", err.message);
    return { ok: false, error: "Could not save the dish. Please try again." };
  }
}

// ---- addVariant ----
export async function addVariant(dishId, formData) {
  await requireAdmin();

  const size = String(formData.get("size") || "").trim();
  if (!size) return { ok: false, error: "Size is required." };

  const price = Number(formData.get("price") || 0);
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Price is required." };
  }

  try {
    const code = await generateVariantCode();
    await prisma.variant.create({
      data: {
        code,
        dishId,
        size,
        price: Math.round(price),
        isActive: true,
      },
    });
    revalidatePath("/admin/dishes/" + dishId);
    revalidatePath("/");
    revalidatePath("/menu");
    return { ok: true };
  } catch (err) {
    console.error("[addVariant] error:", err.message);
    return { ok: false, error: "Could not add the variant. Please try again." };
  }
}

// ---- removeVariant ----
export async function removeVariant(variantId) {
  await requireAdmin();

  try {
    // Check if variant is referenced by any order. If so, mark
    // it inactive instead of deleting (so the order can still
    // show what was ordered).
    const orderItemCount = await prisma.orderItem.count({
      where: { variantId },
    });
    if (orderItemCount > 0) {
      await prisma.variant.update({
        where: { id: variantId },
        data: { isActive: false },
      });
      revalidatePath("/admin/dishes");
      return { ok: true, deactivated: true };
    }
    await prisma.variant.delete({ where: { id: variantId } });
    revalidatePath("/admin/dishes");
    revalidatePath("/");
    revalidatePath("/menu");
    return { ok: true, deactivated: false };
  } catch (err) {
    console.error("[removeVariant] error:", err.message);
    return { ok: false, error: "Could not remove the variant. Please try again." };
  }
}

// ---- deleteDish ----
export async function deleteDish(dishId) {
  await requireAdmin();

  try {
    // Check if dish is referenced by any order. If so, refuse.
    const orderItemCount = await prisma.orderItem.count({
      where: { variant: { dishId } },
    });
    if (orderItemCount > 0) {
      return { ok: false, error: "This dish has past orders. Mark it inactive instead." };
    }
    // Also refuse if there are any event/merch inquiries referencing it.
    // (In our schema, inquiries don't reference dishes, so this is just a guard.)
    await prisma.dish.delete({ where: { id: dishId } });
    revalidatePath("/admin/dishes");
    revalidatePath("/");
    revalidatePath("/menu");
    return { ok: true };
  } catch (err) {
    console.error("[deleteDish] error:", err.message);
    return { ok: false, error: "Could not delete the dish. Please try again." };
  }
}

// ---- addDishPhoto ----
export async function addDishPhoto(dishId, photoUrl) {
  await requireAdmin();

  if (typeof photoUrl !== "string" || !photoUrl.startsWith("https://")) {
    return { ok: false, error: "Invalid photo URL." };
  }

  try {
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { photos: true },
    });
    if (!dish) return { ok: false, error: "Dish not found." };

    const newPhotos = [...(dish.photos || []), photoUrl];
    await prisma.dish.update({
      where: { id: dishId },
      data: { photos: newPhotos },
    });
    revalidatePath("/admin/dishes/" + dishId);
    revalidatePath("/");
    revalidatePath("/menu");
    return { ok: true };
  } catch (err) {
    console.error("[addDishPhoto] error:", err.message);
    return { ok: false, error: "Could not save the photo. Please try again." };
  }
}

// ---- removeDishPhoto ----
export async function removeDishPhoto(dishId, photoUrl) {
  await requireAdmin();

  try {
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { photos: true },
    });
    if (!dish) return { ok: false, error: "Dish not found." };

    const newPhotos = (dish.photos || []).filter((p) => p !== photoUrl);
    await prisma.dish.update({
      where: { id: dishId },
      data: { photos: newPhotos },
    });
    revalidatePath("/admin/dishes/" + dishId);
    revalidatePath("/");
    revalidatePath("/menu");
    return { ok: true };
  } catch (err) {
    console.error("[removeDishPhoto] error:", err.message);
    return { ok: false, error: "Could not remove the photo. Please try again." };
  }
}
