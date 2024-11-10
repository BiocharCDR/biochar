// types/index.ts
import { User } from "@supabase/supabase-js";

export interface UserProfile extends User {
  avatar_url?: string;
  full_name?: string;
}
