// lib/auth.ts
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";
import { cache } from "react";
import { cookies, headers } from "next/headers";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Cached createClient to prevent multiple instances
const getSupabase = cache(() => {
  return createSupabaseServer();
});

/**
 * Get authenticated user with retry logic
 */
export async function getAuthUser(retryCount = 0) {
  const supabase = getSupabase();

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (!session) {
      return { user: null, error: null };
    }

    // Verify the session with getUser
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    return { user, error: null };
  } catch (error) {
    console.error(`Auth error attempt ${retryCount + 1}:`, error);

    // Retry logic
    if (retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAY * (retryCount + 1));
      return getAuthUser(retryCount + 1);
    }

    return {
      user: null,
      error: new Error("Failed to authenticate user after multiple attempts"),
    };
  }
}

/**
 * Protected route wrapper
 */
export async function requireAuth() {
  const { user, error } = await getAuthUser();

  if (!user || error) {
    const searchParams = new URLSearchParams();

    try {
      // Get current path for redirect after login
      const currentPath = new URL(
        headers().get("x-url") || "/",
        "http://localhost"
      ).pathname;
      if (currentPath !== "/signin") {
        searchParams.set("next", currentPath);
      }
    } catch (e) {
      console.error("Error getting current path:", e);
    }

    redirect(
      `/signin${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    );
  }

  return user;
}

/**
 * Check auth status without redirect
 */
export async function checkAuth() {
  const { user, error } = await getAuthUser();

  return {
    isAuthenticated: !!user && !error,
    user,
    error,
  };
}
