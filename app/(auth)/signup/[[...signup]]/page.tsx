"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { SignUp } from "@/components/auth/signup";

const SignUpFallback = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-gray-500">Loading sign-up form...</p>
  </div>
);

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/home";
  return (
    <div className="">
      <Suspense fallback={<SignUpFallback />}>
        <div className="flex flex-col items-center justify-center h-full">
          <SignUp redirectTo={next} />
        </div>
      </Suspense>
    </div>
  );
}
