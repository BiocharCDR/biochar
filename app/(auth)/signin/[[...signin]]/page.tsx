"use client";
import SignIn from "@/components/auth/signin";
import { Suspense } from "react";

const SignInFallback = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-gray-500">Loading sign-in form...</p>
  </div>
);

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <div className="flex flex-col items-center justify-center h-full">
        <SignIn />
      </div>
    </Suspense>
  );
}
