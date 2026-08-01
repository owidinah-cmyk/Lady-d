// /components/laditop/LaditopProcess.js
"use client";

const STEPS = [
  { title: "Tell us what you need", body: "Use the form below to describe the items, quantities, and timeline." },
  { title: "We confirm specs", body: "We confirm specs, quantities, and timeline on WhatsApp within 24 hours." },
  { title: "Approve a proof", body: "You approve a digital proof before production begins." },
  { title: "We produce and deliver", body: "We produce and deliver (or ship) to your location." },
];

const STEP_ICONS = [
  <svg key="edit" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  <svg key="chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  <svg key="check" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  <svg key="box" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
];

export default function LaditopProcess() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        How it works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STEPS.map((step, idx) => (
          <div
            key={step.title}
            className="bg-white border border-hairline rounded-card p-5 sm:p-6"
          >
            <div className="w-8 h-8 rounded-full bg-clay text-white text-sm font-semibold flex items-center justify-center mb-3">
              {idx + 1}
            </div>
            <div className="text-clay mb-3">{STEP_ICONS[idx]}</div>
            <h3 className="font-medium text-ink mb-1 text-sm">{step.title}</h3>
            <p className="text-xs text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
