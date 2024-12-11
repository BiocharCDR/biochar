// app/storage/_components/schema.ts
import { Tables } from "@/supabase/schema";
import { FertilizerInventory } from "@/types";

import * as z from "zod";

export interface QualityParameters {
  ph_level: number | null;
  moisture_content: number | null;
  carbon_content: number | null;
  ash_content: number | null;
}

const qualityParametersSchema = z.object({
  ph_level: z.number().nullable(),
  moisture_content: z.number().nullable(),
  carbon_content: z.number().nullable(),
  ash_content: z.number().nullable(),
});

export const storageFormSchema = z.object({
  biochar_id: z.string().min(1, "Biochar batch is required"),
  storage_location: z.string().min(1, "Storage location is required"),
  storage_date: z.date(),
  quantity_stored: z.number(),

  storage_conditions: z.string().nullable(),
  quality_check_date: z.date().nullable(),
  quality_parameters: qualityParametersSchema.nullable(),
  status: z.enum(["stored", "in_use", "depleted"]).default("stored"),
});

export type StorageFormValues = z.infer<typeof storageFormSchema>;

interface BiocharBatch {
  id: string;
  batch_number: string;
  biochar_weight: number;
  production_date: string;
  biomass_id: string;
  displayName: string;
}

export interface StorageFormProps {
  biocharBatches: Array<
    Pick<
      Tables<"biochar_production">,
      "id" | "batch_number" | "biochar_weight" | "production_date"
    > & { displayName: string }
  >;
  initialData?: Partial<StorageFormValues> & { id?: string };
  isEdit?: boolean;
}

export const STORAGE_CONDITIONS = [
  { label: "Dry Storage", value: "dry" },
  { label: "Ambient", value: "ambient" },
  { label: "Climate Controlled", value: "climate_controlled" },
  { label: "Cold Storage", value: "cold" },
] as const;

export const applicationFormSchema = z.object({
  application_date: z.date(),
  parcel_id: z.string().min(1, "Land parcel is required"),
  quantity_used: z.number().positive("Quantity must be greater than 0"),
  application_method: z.string().nullable(),
  area_covered: z.number().nullable(),
  soil_conditions: z.string().nullable(),
  weather_conditions: z.string().nullable(),
  fertilizer_id: z.string().nullable(),
  fertilizer_quantity: z.number().nullable(),
  mixture_ratio: z.string().nullable(),
  notes: z.string().nullable(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

// Define a more specific type for the storage data we need
export type StorageWithBiochar = Tables<"biochar_storage"> & {
  biochar: Tables<"biochar_production">; // Force biochar to be non-null
};

export interface ApplicationFormProps {
  storage: StorageWithBiochar;
  parcels: Array<{ id: string; parcel_name: string }>;
  fertilizers: FertilizerInventory[];
  initialData?: ApplicationFormValues;
  isEdit?: boolean;
}

export const APPLICATION_METHODS = [
  { label: "Surface Spreading", value: "surface_spreading" },
  { label: "Incorporation", value: "incorporation" },
  { label: "Top Dressing", value: "top_dressing" },
  { label: "Deep Placement", value: "deep_placement" },
] as const;

export const SOIL_CONDITIONS = [
  { label: "Dry", value: "dry" },
  { label: "Moist", value: "moist" },
  { label: "Wet", value: "wet" },
  { label: "Compacted", value: "compacted" },
] as const;

export const WEATHER_CONDITIONS = [
  { label: "Sunny", value: "sunny" },
  { label: "Cloudy", value: "cloudy" },
  { label: "Rainy", value: "rainy" },
  { label: "Windy", value: "windy" },
] as const;
