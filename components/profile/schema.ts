// app/(main)/profile/components/schema.ts
import { Tables } from "@/supabase/schema";
import * as z from "zod";

export const profileFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone_number: z.string().nullable(),
  address: z.string().min(5, "Address must be at least 5 characters."),
  land_ownership_status: z.boolean(),
  num_of_cattle: z.number().min(0),
  carbon_rights_agreement: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface ProfileFormProps {
  initialData: Partial<Tables<"profiles">> | null;
  user: {
    id: string;
    email?: string;
  };
}
