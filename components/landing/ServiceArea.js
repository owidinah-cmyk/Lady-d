// /components/landing/ServiceArea.js
// Simple coverage section for Abuja and Port Harcourt.

import Link from "next/link";

export default function ServiceArea() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-3xl mb-10 text-center">
          Where we deliver
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-cream border border-hairline rounded-card p-6">
            <h3 className="font-serif text-xl mb-2">Abuja</h3>
            <p className="text-muted text-sm">
              Wuse, Maitama, Garki, Asokoro, and more.
            </p>
          </div>
          <div className="bg-cream border border-hairline rounded-card p-6">
            <h3 className="font-serif text-xl mb-2">Port Harcourt</h3>
            <p className="text-muted text-sm">
              GRA, Trans Amadi, Elekahia, and more.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/menu"
            className="text-sm text-clay hover:text-clay-dark font-medium"
          >
            See zones &amp; fees →
          </Link>
        </div>
      </div>
    </section>
  );
}
