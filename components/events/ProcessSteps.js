// /components/events/ProcessSteps.js
"use client";

const STEPS = [
  { title: "Send your inquiry", body: "Use the form below to share your event details." },
  { title: "We confirm details", body: "We review and send a quote on WhatsApp within 24 hours." },
  { title: "Pay deposit", body: "A 50% deposit locks in your date and menu." },
  { title: "We handle the rest", body: "Prep, cooking, and on-site setup are covered." },
  { title: "Enjoy your event", body: "Balance is due on the day." },
];

const STEP_ICONS = [
  <svg key="inbox" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  <svg key="chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  <svg key="card" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  <svg key="chef" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3 6s-3 3-3 5"/><path d="M9 22h6"/><path d="M12 15v7"/></svg>,
  <svg key="done" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
];

export default function ProcessSteps() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">
        How it works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
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
