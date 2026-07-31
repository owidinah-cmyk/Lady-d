// Returns the currently-authenticated customer, or null.
// Use in Server Components (header, layout, pages).

import { cookies } from "next/headers";
import {
  getCustomerBySessionToken,
  COOKIE_NAMES,
} from "@/lib/auth";

export async function getCurrentCustomer() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAMES.customerSession)?.value;
  return getCustomerBySessionToken(token);
}
