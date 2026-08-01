// /components/laditop/TurnaroundGuide.js
"use client";

const ROWS = [
  { label: "Small print jobs", time: "3–5 business days" },
  { label: "Custom apparel", time: "7–10 business days" },
  { label: "Large orders (1,000+ units)", time: "10–14 business days" },
  { label: "Rush orders", time: "Available for an additional fee" },
];

export default function TurnaroundGuide() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-2 text-center">
        Turnaround time guide
      </h2>
      <p className="text-sm text-muted text-center mb-6">
        These are estimates — your timeline is confirmed during inquiry.
      </p>
      <div className="bg-white border border-hairline rounded-card overflow-hidden max-w-3xl mx-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F5F1] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Job type</th>
              <th className="px-4 py-3 font-medium text-right">Est. timeline</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-hairline">
                <td className="px-4 py-3">{row.label}</td>
                <td className="px-4 py-3 text-right text-muted">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
