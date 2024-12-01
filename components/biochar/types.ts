// app/(dashboard)/biochar/types.ts

import { Database } from "@/supabase/schema";

export type BiocharProduction =
  Database["public"]["Tables"]["biochar_production"]["Row"] & {
    biomass?: {
      id: string;
      crop_type: string;
    } | null;
    storage?: {
      id: string;
      storage_location: string;
      quantity_stored: number;
      status: string | null;
    } | null;
  };

// Quality parameters type
export interface QualityParameters {
  ph_level?: number;
  moisture_content?: number;
  carbon_content?: number;
  ash_content?: number;
  surface_area?: number;
  notes?: string;
}

// Status types
export const PRODUCTION_STATUS = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ProductionStatus =
  (typeof PRODUCTION_STATUS)[keyof typeof PRODUCTION_STATUS];

export const STORAGE_STATUS = {
  STORED: "stored",
  IN_USE: "in_use",
  DEPLETED: "depleted",
} as const;

export type StorageStatus =
  (typeof STORAGE_STATUS)[keyof typeof STORAGE_STATUS];

type BiocharProd = Database["public"]["Tables"]["biochar_production"]["Row"];

export interface BiocharProductionWithRelations extends BiocharProd {
  biomass?: {
    id: string;
    crop_type: string;
  } | null;
  storage?: {
    id: string;
    storage_location: string;
    quantity_stored: number;
    status: string | null;
  } | null;
}
