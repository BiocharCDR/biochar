// types/index.ts
import { User } from "@supabase/supabase-js";

export interface UserProfile extends User {
  avatar_url?: string;
  full_name?: string;
}

export interface Project {
  id: string;
  name: string;
  consultant: {
    name: string;
    avatar: string;
  };
  client: {
    name: string;
    avatar: string;
  };
  contractValue: string;
  certificationTarget: string;
  stage: number;
  progress: number;
  flag: "No Flag" | "Red Flag";
}
