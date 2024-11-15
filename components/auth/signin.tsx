import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(6, { message: "Password is too short" }),
  remember: z.boolean().optional(),
});

export default function SignIn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/home";

  const signInForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(data: z.infer<typeof SignInSchema>) {
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

  const loginWithProvider = (provider: "google") => {
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
      <div className="mb-8">
        <Image
          src="/logo-2.png"
          alt="GreenA"
          className="mx-auto h-8 w-auto"
          width={100}
          height={100}
        />
      </div>
      <div className=" text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
          Log in to your account
        </h2>
        <p className="mb-8 text-gray-600">
          Welcome back! Please enter your details.
        </p>
      </div>

      <Form {...signInForm}>
        <form
          onSubmit={signInForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={signInForm.control}
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
            control={signInForm.control}
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
              control={signInForm.control}
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

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={() => loginWithProvider("google")}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </form>
      </Form>

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
