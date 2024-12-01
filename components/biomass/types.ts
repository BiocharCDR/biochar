import { Database } from "@/supabase/schema";

export type BiomassProduction =
  Database["public"]["Tables"]["biomass_production"]["Row"] & {
    land_parcels?: {
      parcel_name: string;
    } | null;
  };

export interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}

type BiomassProd = Database["public"]["Tables"]["biomass_production"]["Row"];

export interface BiomassProductionWithParcelName extends BiomassProd {
  land_parcels?: {
    parcel_name: string;
  } | null;
}
