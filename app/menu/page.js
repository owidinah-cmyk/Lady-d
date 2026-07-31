// /app/menu/page.js
// The /menu page. Fetches categories, dishes, zones, and the
// current zone (from the cart cookie). Renders the zone selector
// + menu view. Uses the resilience pattern.

import { getCategories, getDishesByCategory, getActiveZones } from "@/lib/menu/queries";
import { readCart } from "@/lib/cart/cookie";
import ZoneSelector from "@/components/menu/ZoneSelector";
import MenuView from "@/components/menu/MenuView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menu — Lady D Kitchen",
  description: "Our full menu of home-style dishes, delivered in Abuja and Port Harcourt.",
};

export default async function MenuPage() {
  // Fetch data in parallel. Each helper handles its own DB errors.
  const [categories, dishes, zones] = await Promise.all([
    getCategories(),
    getDishesByCategory({}),
    getActiveZones(),
  ]);

  // Read the current zone from the cart cookie (no DB needed).
  const cart = readCart();
  const currentZoneId = cart.zoneId;

  // Show a closed-banner if we're currently outside kitchen hours.
  let currentlyOpen = true;
  try {
    const { isOpenAt } = await import("@/lib/hours");
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 5);
    const check = await isOpenAt(today, currentTime);
    currentlyOpen = check.open;
  } catch {
    // If the hours check fails, fall back to showing the menu.
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {currentlyOpen === false && (
          <div className="bg-cream border border-hairline rounded-md p-3 mb-6 text-sm text-ink">
            We're currently closed. You can still browse the menu and place an order for our next open slot.
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl mb-2">Menu</h1>
            <p className="text-sm text-muted">
              All dishes are cooked fresh to order. Pick a delivery
              zone, then build your order.
            </p>
          </div>
          {zones.length > 0 && (
            <ZoneSelector zones={zones} currentZoneId={currentZoneId} />
          )}
        </div>

        <MenuView categories={categories} dishes={dishes} />
      </div>
    </main>
  );
}
