// /components/admin/AdminShell.js
// Wraps the admin pages with the sidebar + topbar. The
// /admin/layout.js handles auth server-side; this component
// just renders the chrome.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  OrdersIcon,
  DishesIcon,
  ZonesIcon,
  ClosingHoursIcon,
  RidersIcon,
  ReviewsIcon,
  EventsIcon,
  LaditopIcon,
  SettingsIcon,
} from "./icons";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true, icon: DashboardIcon },
  { href: "/admin/orders", label: "Orders", icon: OrdersIcon },
  { href: "/admin/dishes", label: "Dishes", icon: DishesIcon },
  { href: "/admin/zones", label: "Zones", icon: ZonesIcon },
  { href: "/admin/closing-hours", label: "Closing hours", icon: ClosingHoursIcon },
  { href: "/admin/riders", label: "Riders", icon: RidersIcon },
  { href: "/admin/reviews", label: "Reviews", icon: ReviewsIcon },
  { href: "/admin/events", label: "Events", icon: EventsIcon },
  { href: "/admin/laditop", label: "Laditop", icon: LaditopIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminShell({ children, adminEmail }) {
  const pathname = usePathname();

  function isActive(item) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  return (
    <div className="min-h-screen bg-[#F7F5F1] text-[#1A1614] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-[#E8E2D5] bg-white">
        <div className="p-5 border-b border-[#E8E2D5]">
          <p className="text-xs uppercase tracking-wide text-[#A69A88]">
            Admin
          </p>
          <p className="text-sm font-medium mt-0.5 truncate">
            {adminEmail}
          </p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm rounded transition-colors ${
                  active
                    ? "bg-[#1A1614] text-white"
                    : "text-[#1A1614] hover:bg-[#F7F5F1]"
                }`}
              >
                <Icon className="mr-2 flex-none" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#E8E2D5]">
          <form action="/api/admin/auth/logout" method="post">
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-sm text-[#7A2634] hover:bg-[#F7F5F1] rounded transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top nav (placeholder — full mobile nav is
          deferred; the sidebar is hidden on mobile and pages
          still work, just without the nav. Acceptable for
          staff tooling.) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#E8E2D5] px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-medium">Admin · {adminEmail}</p>
        <form action="/api/admin/auth/logout" method="post">
          <button
            type="submit"
            className="text-sm text-[#7A2634]"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-x-auto md:mt-0 mt-14">
        {children}
      </main>
    </div>
  );
}
