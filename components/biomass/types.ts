import { Database, Tables } from "@/supabase/schema";

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
  land_parcels: {
    id: string | null;
    parcel_name: string | null;
    total_area: number | null;
    cultivable_area: number | null;
  } | null;
}

export type BiomassUsageProps = Tables<"biomass_usage"> & {
  biochar_production: Pick<
    Tables<"biochar_production">,
    | "batch_number"
    | "biochar_weight"
    | "biomass_id"
    | "biomass_weight"
    | "combustion_temperature"
    | "created_at"
    | "end_time"
    | "farmer_id"
    | "id"
    | "production_date"
    | "production_notes"
    | "quality_parameters"
    | "start_time"
    | "status"
    | "updated_at"
    | "water_usage"
    | "yield_percentage"
  >;
};
