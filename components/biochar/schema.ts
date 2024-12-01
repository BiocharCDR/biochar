// app/(dashboard)/biochar/components/biochar-form/schema.ts
import { z } from "zod";
import { PRODUCTION_STATUS } from "./types";

export const biocharFormSchema = z.object({
  biomass_id: z.string({
    required_error: "Please select a biomass source",
  }),
  batch_number: z.string({
    required_error: "Batch number is required",
  }),
  production_date: z.date({
    required_error: "Production date is required",
  }),
  start_time: z.string({
    required_error: "Start time is required",
  }),
  end_time: z.string({
    required_error: "End time is required",
  }),
  biomass_weight: z.coerce
    .number()
    .min(0.01, "Biomass weight must be greater than 0")
    .max(100000, "Biomass weight seems too high"),
  combustion_temperature: z.coerce
    .number()
    .min(0, "Temperature cannot be negative")
    .nullable(),
  water_usage: z.coerce
    .number()
    .min(0, "Water usage cannot be negative")
    .nullable(),
  biochar_weight: z.coerce
    .number()
    .min(0, "Biochar weight cannot be negative")
    .nullable(),
  yield_percentage: z.coerce
    .number()
    .min(0, "Yield must be non-negative")
    .max(100, "Yield cannot exceed 100%")
    .nullable(),
  quality_parameters: z
    .object({
      ph_level: z.number().min(0).max(14).nullable(),
      moisture_content: z.number().min(0).max(100).nullable(),
      carbon_content: z.number().min(0).max(100).nullable(),
      ash_content: z.number().min(0).max(100).nullable(),
    })
    .nullable(),
  production_notes: z.string().nullable(),
  status: z
    .enum([
      PRODUCTION_STATUS.IN_PROGRESS,
      PRODUCTION_STATUS.COMPLETED,
      PRODUCTION_STATUS.FAILED,
    ])
    .default(PRODUCTION_STATUS.IN_PROGRESS),
});

export type BiocharFormValues = z.infer<typeof biocharFormSchema>;

export interface BiomassRecord {
  id: string;
  crop_type: string;
  harvest_date: string;
  crop_yield: number | null;
  residue_generated: number | null;
  residue_storage_location: string | null;
}

export interface BiocharFormProps {
  biomassRecords: BiomassRecord[];
  initialData?: BiocharFormValues & { id: string };
  isEdit?: boolean;
}
