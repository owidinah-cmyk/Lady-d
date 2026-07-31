import TestEmailForm from "./TestEmailForm";

export const dynamic = "force-dynamic";

export default function AdminTestEmailPage() {
  return (
    <div className="max-w-xl space-y-4">
      <header>
        <h1 className="font-serif text-3xl mb-1">Send a test email</h1>
        <p className="text-sm text-muted">
          Verify Brevo is configured and emails are reaching
          inboxes. Sends a real email.
        </p>
      </header>
      <TestEmailForm />
    </div>
  );
}
