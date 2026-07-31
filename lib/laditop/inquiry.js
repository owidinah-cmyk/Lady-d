// Server-side: creates a MerchInquiry + related MerchInquiryItem
// rows. The schema has a separate MerchInquiryItem table for
// per-item notes (quantity, customization).

import { prisma } from "@/lib/db";
import { generateMerchInquiryRef } from "@/lib/orders/ref";

export async function createMerchInquiry({
  customerId,
  customerName,
  customerPhone,
  customerEmail,
  neededByDate,
  notes,
  items,
}) {
  const ref = await generateMerchInquiryRef();

  const inquiry = await prisma.merchInquiry.create({
    data: {
      ref,
      customerId: customerId || null,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      neededByDate: new Date(neededByDate),
      notes: notes || null,
      status: "NEW",
      items: {
        create: items.map((item) => ({
          itemType: item.itemType,
          customLabel: item.customLabel || null,
          quantity: item.quantity ? Number(item.quantity) : null,
          notes: item.notes || null,
        })),
      },
    },
    include: { items: true },
  });

  return inquiry;
}
