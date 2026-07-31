// /app/admin/login/page.js
// Server component that renders a simple, focused login form.
// The form posts to /api/admin/auth/login via a small client component.

import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login — Lady D Kitchen",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F1] text-[#1A1614] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#E8E2D5] rounded-card p-8">
        <h1 className="font-serif text-3xl mb-2">Admin Login</h1>
        <p className="text-[#A69A88] text-sm mb-6">
          Staff only. Authorized access only.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
