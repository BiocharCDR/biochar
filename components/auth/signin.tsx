"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(6, { message: "Password is too short" }),
  remember: z.boolean().optional(),
});

const PhoneSignInSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number is too short" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Please enter a valid phone number",
    }),
});

const OtpVerificationSchema = z.object({
  pin: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export default function SignIn() {
  const [isPending, startTransition] = useTransition();
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/home";

  const emailForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const phoneForm = useForm<z.infer<typeof PhoneSignInSchema>>({
    resolver: zodResolver(PhoneSignInSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<z.infer<typeof OtpVerificationSchema>>({
    resolver: zodResolver(OtpVerificationSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onEmailSubmit(data: z.infer<typeof SignInSchema>) {
    const supabase = createSupabaseBrowser();
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        toast.error(error.message);
      } else {
        router.replace(next);
      }
    });
  }

  async function onPhoneSubmit(data: z.infer<typeof PhoneSignInSchema>) {
    const supabase = createSupabaseBrowser();
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        phone: data.phone,
      });
      if (error) {
        toast.error(error.message);
      } else {
        setIsVerifying(true);
        toast.success("OTP sent successfully!");
      }
    });
  }

  async function onOtpSubmit(data: z.infer<typeof OtpVerificationSchema>) {
    const supabase = createSupabaseBrowser();
    const phone = phoneForm.getValues("phone");

    startTransition(async () => {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: data.pin,
        type: "sms",
      });
      if (error) {
        toast.error(error.message);
      } else {
        router.replace(next);
      }
    });
  }

  const signInWithProvider = (provider: "google") => {
    const supabase = createSupabaseBrowser();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${next}`,
      },
    });
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Log in to your account
        </h2>
        <p className="mb-8 text-gray-600">
          Welcome back! Please enter your details.
        </p>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={emailForm.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Remember for 30 days
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href="/forgot-password"
                  className="text-sm text-teal-700 hover:text-teal-600"
                >
                  Forgot password
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-600 h-11"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="phone">
          {!isVerifying && (
            <Form {...phoneForm}>
              <form
                onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          type="tel"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-600 h-11"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Send OTP
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          {isVerifying && (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={otpForm.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          defaultValue={otpForm.getValues("pin")}
                          className="h-11 text-center text-lg tracking-wider "
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </FormControl>
                      <FormDescription>
                        Please enter the verification code sent to{" "}
                        {phoneForm.getValues("phone")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-teal-700 hover:text-teal-600"
                    onClick={() => {
                      setIsVerifying(false);
                      otpForm.reset();
                    }}
                  >
                    Change phone number
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-teal-700 hover:text-teal-600"
                    onClick={() => phoneForm.handleSubmit(onPhoneSubmit)()}
                    disabled={isPending}
                  >
                    Resend code
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-600 h-11"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </TabsContent>
      </Tabs>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11"
        onClick={() => signInWithProvider("google")}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Sign in with Google
      </Button>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup?next=${next}`}
          className="font-medium text-teal-700 hover:text-teal-600"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
