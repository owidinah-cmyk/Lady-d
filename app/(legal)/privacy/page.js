import PolicyHeader from "../PolicyHeader";

export const metadata = {
  title: "Privacy Policy — Lady D Kitchen",
  description:
    "Privacy Policy for Lady D Kitchen Catering Services — what we collect, how we use it, and your rights.",
};

export default function PrivacyPage() {
  return (
    <>
      <PolicyHeader title="Privacy Policy" lastUpdated={new Date()} />
      <div className="space-y-6 leading-relaxed text-ink">
        <p>
          This policy explains what information Lady D Kitchen Catering
          Services collects when you use this website, and how it is used.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">1. Information we collect</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>Account information:</strong> name, email address, and (if you sign up
            via Facebook) the basic profile information Facebook provides.
          </li>
          <li>
            <strong>Order information:</strong> phone number, delivery location/zone,
            delivery date and time, items ordered, and any notes you provide.
          </li>
          <li>
            <strong>Event and Laditop inquiries:</strong> event type or item type, date
            needed, guest count or quantity, and contact details.
          </li>
          <li>
            <strong>Reviews:</strong> any rating or comment you submit, linked to your
            account and the relevant order.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">2. How we use this information</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            To process and coordinate your order or inquiry, including
            contacting you via WhatsApp or phone.
          </li>
          <li>
            To maintain your order history and receipts in your account.
          </li>
          <li>
            To assign deliveries to riders, who receive your name, phone
            number, and delivery address for that purpose only.
          </li>
          <li>
            To moderate and display reviews.
          </li>
          <li>
            To improve our menu, service zones, and offerings.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">3. Sharing</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            We do not sell or rent your personal information to third
            parties.
          </li>
          <li>
            We share your name, phone number, and delivery address with
            our delivery rider for the purpose of fulfilling your order.
          </li>
          <li>
            We share your information with service providers that help us
            run the website (database hosting, email delivery) under
            confidentiality obligations.
          </li>
          <li>
            We may disclose information if required by law.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">4. What we will never do</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            We will never post your payment or bank details anywhere, and
            we never ask for your bank details through any channel other
            than a direct WhatsApp conversation with our staff.
          </li>
          <li>
            We will never use your data for advertising targeting outside
            of standard Facebook/Instagram ad platform tools you may
            already interact with independently of us.
          </li>
        </ul>

        <h2 className="font-serif text-2xl mt-10 mb-3">5. Where your information is stored</h2>
        <p className="mb-4">
          Your account and order information is stored in our database
          (hosted via Neon/Postgres) and our hosting infrastructure (Vercel).
          Information shared over WhatsApp is subject to WhatsApp&apos;s own
          privacy practices, not ours.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">6. Your rights</h2>
        <p className="mb-4">
          You may request to see, correct, or delete your account information
          by contacting us via WhatsApp. Note that some order records may be
          retained for legitimate business record-keeping (for example,
          resolving a dispute) even after an account deletion request.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">7. Cookies</h2>
        <p className="mb-4">
          This website uses cookies necessary for login sessions and for
          remembering your cart, delivery zone, and (with your consent) your
          delivery address. We do not use third-party tracking or advertising
          cookies beyond what Facebook/Instagram&apos;s own ad tools require if
          you arrived via an ad.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">8. Changes to this policy</h2>
        <p className="mb-4">
          We may update this policy from time to time. The &quot;last updated&quot;
          date at the top will reflect the most recent version.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-3">9. Contact</h2>
        <p className="mb-4">
          For privacy questions or requests, reach out via WhatsApp through
          the number provided on this website.
        </p>
      </div>
    </>
  );
}
