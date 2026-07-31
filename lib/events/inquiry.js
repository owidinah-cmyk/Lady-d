// Server-side: creates an EventInquiry row + logs a status.
// Note: EventInquiry uses a categories String[] field, not a
// separate table. So no related rows to create here.

import { prisma } from "@/lib/db";
import { generateEventInquiryRef } from "@/lib/orders/ref";

export async function createEventInquiry({
  customerId,
  customerName,
  customerPhone,
  customerEmail,
  eventDate,
  guestCount,
  location,
  categories,
  packageInterest,
  notes,
}) {
  const ref = await generateEventInquiryRef();

  const inquiry = await prisma.eventInquiry.create({
    data: {
      ref,
      customerId: customerId || null,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      eventDate: new Date(eventDate),
      guestCount: Number(guestCount),
      location,
      categories: Array.isArray(categories) ? categories : [],
      packageInterest: packageInterest || null,
      notes: notes || null,
      status: "NEW",
    },
  });

  return inquiry;
}
