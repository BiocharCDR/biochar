import { Database } from "@/supabase/schema";
import { createClient } from "@supabase/supabase-js";

export default function supabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABAE_ADMIN!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
