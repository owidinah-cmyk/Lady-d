import PolicyHeader from "../PolicyHeader";

export const metadata = {
  title: "Refund & Dispute Policy — Lady D Kitchen",
  description:
    "Refund and dispute resolution policy for Lady D Kitchen orders — cancellations, complaints, and late delivery.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <PolicyHeader title="Refund & Dispute Policy" lastUpdated={new Date()} />
      <div className="space-y-6 leading-relaxed text-ink">
        <p>
          We want every order to arrive right. If something goes wrong,
          here&apos;s how we handle it.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">1. Cancellations</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            If you need to cancel your order, contact us on WhatsApp as
            soon as possible, ideally <em>before</em> paying your deposit.
          </li>
          <li>
            <strong>Once a deposit has been paid, your order is committed and
            the deposit is non-refundable.</strong> Because ingredients are
            procured against your specific order, deposits cannot be
            returned after payment. In exceptional circumstances (such
            as bereavement or medical emergency), we may, at our discretion,
            offer a credit toward a future order — but this is not a
            guarantee and is decided case by case.
          </li>
          <li>
            For Laditop (merchandise and printing) and Events catering,
            deposits are non-refundable once production or event
            preparation has begun. Cancellations received before production
            or preparation starts may be eligible for a full refund at our
            discretion.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">2. If your order arrives wrong, incomplete, or damaged</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Please inspect your order with the rider at the point of
            delivery where possible.
          </li>
          <li>
            Contact us on WhatsApp <strong>within 2 hours of delivery</strong> with your
            order reference number and a description (and a photo, if
            possible) of the issue.
          </li>
          <li>
            <strong>After 2 hours, we are unable to process refunds or redos</strong>
            because payment has already been completed and reconciled for
            that order.
          </li>
          <li>
            Depending on the situation, we will offer one of the following:
            a redo of the affected item, a partial refund, or a credit
            toward a future order. Which outcome applies depends on the
            nature of the issue and will be discussed directly with you.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">3. Late delivery</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            We aim to deliver within the window agreed at order confirmation.
          </li>
          <li>
            If delivery is significantly delayed, contact us on WhatsApp
            with your order reference number and we will update you on
            status directly.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">4. What we need from you to resolve a dispute</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Your order reference number</li>
          <li>Your deposit receipt and/or final receipt</li>
          <li>
            A description of the issue (and photo evidence where relevant)
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">5. Terms</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Resolution outcomes are decided case by case by Lady D Kitchen
            Catering Services staff, taking into account the circumstances
            of each order. This policy is designed to be fair to both
            customers and the business.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">6. Contact</h2>
        <p className="mb-4">
          All disputes are handled through WhatsApp using the order
          reference number system — this keeps a clear record for both sides.
        </p>
      </div>
    </>
  );
}
