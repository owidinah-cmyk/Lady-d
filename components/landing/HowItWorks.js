// /components/landing/HowItWorks.js
// 4-step process: browse → build order → WhatsApp handoff → pay deposit & cook.

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-hairline">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="font-serif text-3xl mb-10 text-center">
          How Lady D Kitchen works
        </h2>
        <ol className="space-y-8">
          {[
            {
              title: "Browse the menu",
              body: "Pick what you’d like. Every dish is sold in litre-sized portions with clear prices.",
            },
            {
              title: "Build your order",
              body: "Add multiple dishes and quantities. You’ll see your total update as you go.",
            },
            {
              title: "Send it to us on WhatsApp",
              body: "At checkout, we open WhatsApp with your order already typed. You don’t retype anything.",
            },
            {
              title: "Pay a deposit, we cook and deliver",
              body: "We confirm your order, you pay a 40–50% deposit by bank transfer, we cook, and our rider delivers. Balance on delivery.",
            },
          ].map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-clay text-white font-semibold flex items-center justify-center text-sm">
                {idx + 1}
              </span>
              <div>
                <h3 className="font-medium text-lg">{step.title}</h3>
                <p className="text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
