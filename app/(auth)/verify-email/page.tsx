"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ArrowLeft, Mail, RotateCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const [isResending, setIsResending] = React.useState(false);

  const handleResendEmail = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    const supabase = createSupabaseBrowser();

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      toast.success("Verification email sent");
    } catch (error) {
      toast.error("Could not send email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="absolute top-8">
        <img src="/logo-2.png" alt="GreenA" className="h-6" />
      </div>

      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                "bg-teal-50 transition-transform hover:scale-105"
              )}
            >
              <Mail className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a verification link to <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Check your email and click the verification link to continue
              </p>
              <p>• If you don&apos;t see it, check your spam folder</p>
              <p>• The link will expire in 24 hours</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={isResending}
            className={cn(
              "w-full",
              isResending && "text-transparent transition-colors"
            )}
          >
            {isResending && (
              <RotateCw className="absolute h-4 w-4 animate-spin" />
            )}
            {!isResending && (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <Link href="/signin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Need help?{" "}
            <Link
              href="/support"
              className="text-teal-600 underline-offset-4 hover:underline"
            >
              Contact support
            </Link>
          </p>
        </CardFooter>
      </Card>

      <footer className="absolute bottom-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} GreenA. All rights reserved.</p>
      </footer>
    </div>
  );
}
