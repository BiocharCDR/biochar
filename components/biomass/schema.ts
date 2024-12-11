// app/(dashboard)/biomass/components/biomass-form/schema.ts
import { z } from "zod";

export const biomassFormSchema = z.object({
  parcel_id: z.string({
    required_error: "Please select a parcel",
  }),
  crop_type: z.string({
    required_error: "Please enter the crop type",
  }),
  harvest_date: z.date({
    required_error: "Please select a harvest date",
  }),
  // Biomass Information
  crop_yield: z.coerce.number().min(0, "Yield must be positive").nullable(),
  moisture_content: z.coerce
    .number()
    .min(0, "Moisture content must be positive")
    .max(100, "Moisture content cannot exceed 100%")
    .nullable(),
  quality_grade: z.string().nullable(),

  // Biomass Storage
  biomass_storage_location: z.string().nullable(),
  biomass_storage_date: z.date().nullable(),
  biomass_storage_conditions: z.string().nullable(),
  biomass_quantity: z.coerce
    .number()
    .min(0, "Quantity must be positive")
    .nullable(),
  biomass_storage_proof: z.instanceof(File).optional(),

  // Residue Storage
  residue_generated: z.coerce
    .number()
    .min(0, "Residue must be positive")
    .nullable(),
  residue_storage_location: z.string().nullable(),
  residue_storage_date: z.date().nullable(),
  residue_storage_conditions: z.string().nullable(),
  residue_storage_proof: z.instanceof(File).optional(),

  notes: z.string().nullable(),
  status: z.enum(["stored", "in_process", "used"]).default("stored"),
});

export type BiomassFormValues = z.infer<typeof biomassFormSchema>;

// Type for data being sent to Supabase
export type BiomassInsertData = Omit<
  BiomassFormValues,
  | "harvest_date"
  | "biomass_storage_date"
  | "residue_storage_date"
  | "biomass_storage_proof"
  | "residue_storage_proof"
> & {
  harvest_date: string;
  biomass_storage_date: string | null;
  residue_storage_date: string | null;
  biomass_storage_proof_url?: string | null;
  residue_storage_proof_url?: string | null;
};

export interface Parcel {
  id: string;
  parcel_name: string;
}

export interface BiomassFormProps {
  parcels: Parcel[];
  initialData?: BiomassFormValues;
  isEdit?: boolean;
}

export const STORAGE_CONDITIONS = [
  { label: "Dry Storage", value: "dry" },
  { label: "Cold Storage", value: "cold" },
  { label: "Ambient", value: "ambient" },
  { label: "Climate Controlled", value: "controlled" },
] as const;

export const QUALITY_GRADES = [
  { label: "Grade A", value: "A" },
  { label: "Grade B", value: "B" },
  { label: "Grade C", value: "C" },
] as const;
