import { checkAuth } from "@/lib/supabase";
import { redirect } from "next/navigation";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated } = await checkAuth();
  if (isAuthenticated) {
    return redirect("/home");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="relative w-full">
        {/* Left Decoration */}
        <div
          className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 blur-3xl"
          aria-hidden="true"
        >
          <div className="aspect-square h-[400px] rounded-full bg-teal-100/40" />
        </div>

        {/* Right Decoration */}
        <div
          className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 blur-3xl"
          aria-hidden="true"
        >
          <div className="aspect-square h-[400px] rounded-full bg-teal-100/40" />
        </div>

        {/* Main Content */}
        <div className="relative mx-auto max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Biochar dMRV. All rights reserved.</p>
      </div>
    </div>
  );
}
