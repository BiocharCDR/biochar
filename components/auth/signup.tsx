import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(8, { message: "Must be at least 8 characters" }),
});

export function SignUp({ redirectTo }: { redirectTo: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof SignUpSchema>) {
    const supabase = createSupabaseBrowser();
    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        router.push("/verify-email");
      }
    });
  }

  const signUpWithProvider = (provider: "google") => {
    const supabase = createSupabaseBrowser();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${redirectTo}`,
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
          Create an account
        </h2>
        <p className="mb-8 text-gray-600">Start your 30-day free trial.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
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
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password*</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-gray-600">
                  Must be at least 8 characters.
                </p>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-600 h-11 font-bold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting started...
              </>
            ) : (
              "Get started"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={() => signUpWithProvider("google")}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign up with Google
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href={redirectTo ? `/signin?next=${redirectTo}` : "/signin"}
          className="font-medium text-teal-700 hover:text-teal-600"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
