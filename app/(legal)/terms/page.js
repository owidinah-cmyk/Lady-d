import PolicyHeader from "../PolicyHeader";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Lady D Kitchen",
  description:
    "Terms of Service for Lady D Kitchen Catering Services — orders, payments, delivery, and accounts.",
};

export default function TermsPage() {
  return (
    <>
      <PolicyHeader title="Terms of Service" lastUpdated={new Date()} />
      <div className="space-y-6 leading-relaxed text-ink">
        <p>
          Welcome to Lady D Kitchen. By creating an account or placing an
          order through this website, you agree to the following terms.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">1. Who we are</h2>
        <p className="mb-4">
          Lady D Kitchen Catering Services (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates the
          Lady D Kitchen website, providing home-style catering, branded
          merchandise (Laditop), and event catering. We prepare and deliver
          food in Abuja and Port Harcourt, Nigeria.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">2. Orders and how they work</h2>
        <p className="mb-4">
          Orders placed on this website are order <em>requests</em>. An order is
          only confirmed once our staff have contacted you directly on
          WhatsApp and confirmed availability, pricing, and delivery details.
          Prices shown on the website are accurate at the time of browsing
          but may be reconfirmed at the point of order due to ingredient or
          logistics changes.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">3. Payment</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            A deposit (typically 40–50% of the order total) is required to
            confirm your order. The remaining balance is paid on delivery.
          </li>
          <li>
            We do not process payments on this website. All payments are
            made by direct bank transfer, and payment details are only ever
            shared with you personally by a verified staff member through
            WhatsApp — never posted publicly on this site, in advertisements,
            or through any automated message.
          </li>
          <li>
            If you receive payment details from any other source claiming to
            be Lady D Kitchen, do not send money and contact us directly to
            verify.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">4. Delivery</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            Delivery is available within our defined delivery zones in Abuja
            and Port Harcourt only. Delivery fees vary by zone and are shown
            before checkout.
          </li>
          <li>
            Some dishes require advance notice (&quot;lead time&quot;) before they can
            be delivered — this is shown on the dish itself.
          </li>
          <li>
            Our dispatch rider will contact you directly by phone or message
            ahead of delivery.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">5. Receipts</h2>
        <p className="mb-4">
          You will receive two receipts per order: a deposit receipt when
          your deposit is confirmed, and a final receipt when the balance is
          collected on delivery. Both are also saved to your account for
          your records.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">6. Accounts</h2>
        <p className="mb-4">
          You may create an account using Facebook sign-in or an email
          address and password. You are responsible for keeping your login
          secure. You must be able to receive communication at the phone
          number and contact details you provide, as these are used to
          coordinate your order.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">7. Reviews</h2>
        <p className="mb-4">
          You may leave a review only for an order that has been marked
          &quot;Delivered/Paid&quot; on your account. Reviews are moderated before
          appearing publicly and may be removed if they contain false claims,
          abusive language, or unrelated content.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">8. Cancellations, refunds, and disputes</h2>
        <p className="mb-4">
          See our separate{" "}
          <Link href="/refund-policy" className="text-clay hover:underline">
            Refund &amp; Dispute Policy
          </Link>
          , which forms part of these terms.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">9. Changes to these terms</h2>
        <p className="mb-4">
          We may update these terms from time to time. Continued use of the
          website after changes are posted means you accept the updated terms.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">10. Contact</h2>
        <p className="mb-4">
          For any questions about these terms, reach out to us via WhatsApp
          through the number provided on this website.
        </p>
      </div>
    </>
  );
}
