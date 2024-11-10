// lib/supabase/middleware.ts
import { publicPaths, protectedPaths } from "@/constants";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const path = url.pathname;
  const next = url.searchParams.get("next") || path;

  if (user) {
    if (publicPaths.includes(path)) {
      // Redirect logged-in users from public routes to dashboard
      return NextResponse.redirect(new URL("/home", request.url));
    }
    // Allow access to protected routes
    return response;
  } else {
    if (protectedPaths.some((route) => path.startsWith(route))) {
      // Redirect to signin if trying to access protected routes
      return NextResponse.redirect(
        new URL(`/signin?next=${next}`, request.url)
      );
    }
    // Allow access to public routes
    return response;
  }
}
