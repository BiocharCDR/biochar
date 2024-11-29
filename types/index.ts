// types/index.ts
import { Database } from "@/supabase/schema";
import { User } from "@supabase/supabase-js";

export interface UserProfile extends User {
  avatar_url?: string;
  full_name?: string;
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ProductionMetric =
  Database["public"]["Tables"]["production_metrics"]["Row"];

export type ParcelDocument =
  Database["public"]["Tables"]["parcel_documents"]["Row"];

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export type LandParcel = Database["public"]["Tables"]["land_parcels"]["Row"];

export type FertilizerUsage =
  Database["public"]["Tables"]["fertilizer_usage"]["Row"];

export type FertilizerInventory =
  Database["public"]["Tables"]["fertilizer_inventory"]["Row"];

export type BiomassProduction =
  Database["public"]["Tables"]["biomass_production"]["Row"];

export type BiocharStorage =
  Database["public"]["Tables"]["biochar_storage"]["Row"];

export type BiocharProduction =
  Database["public"]["Tables"]["biochar_production"]["Row"];

export type BiocharApplication =
  Database["public"]["Tables"]["biochar_application"]["Row"];

export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
