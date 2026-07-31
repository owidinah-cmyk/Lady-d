// /components/landing/PaymentSafety.js
// Terracotta-tinted card explaining payment safety.

export default function PaymentSafety() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white border border-hairline rounded-card p-6">
          <h2 className="font-serif text-2xl mb-3">
            A note on payment safety
          </h2>
          <p className="text-ink leading-relaxed">
            We will never post our bank details publicly. We share them only
            inside an active WhatsApp conversation, with you, after you place
            an order. If you receive payment details from any other source
            claiming to be us, please don’t pay — and reach out to verify.
          </p>
        </div>
      </div>
    </section>
  );
}
