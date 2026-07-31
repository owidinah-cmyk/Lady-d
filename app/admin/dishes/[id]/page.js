import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { formatPrice } from "@/lib/menu/dishes";
import DishEditForm from "./DishEditForm";
import VariantsManager from "./VariantsManager";
import PhotoUploader from "./PhotoUploader";
import DeleteDishButton from "./DeleteDishButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      select: { name: true },
    });
    return { title: dish ? `Edit ${dish.name} — Admin` : "Edit dish — Admin" };
  } catch {
    return { title: "Edit dish — Admin" };
  }
}

export default async function EditDishPage({ params }) {
  await requireAdmin();

  let dish = null;
  try {
    dish = await prisma.dish.findUnique({
      where: { id: params.id },
      include: {
        variants: { orderBy: { price: "asc" } },
      },
    });
  } catch (err) {
    console.error("[EditDishPage] DB error:", err.message);
  }

  if (!dish) notFound();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";
  const cloudinaryConfigured = Boolean(cloudName && uploadPreset);

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <Link href="/admin/dishes" className="text-sm text-[#D4AF5A] hover:underline mb-2 inline-block">
          ← All dishes
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl">{dish.name}</h1>
          <span className="text-sm font-mono text-[#A69A88]">{dish.code}</span>
        </div>
      </header>

      <PhotoUploader
        dishId={dish.id}
        photos={dish.photos || []}
        cloudinaryConfigured={cloudinaryConfigured}
        cloudName={cloudName}
        uploadPreset={uploadPreset}
      />
      <DishEditForm dish={dish} />
      <VariantsManager dishId={dish.id} variants={dish.variants} />
      <DeleteDishButton dishId={dish.id} dishName={dish.name} />
    </div>
  );
}
