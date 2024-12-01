import { z } from "zod";

export const biomassFormSchema = z.object({
  parcel_id: z.string({
    required_error: "Please select a parcel",
  }),
  crop_type: z.string({
    required_error: "Please enter the crop type",
  }),
  harvest_date: z.date({
    // Keep as Date for form handling
    required_error: "Please select a harvest date",
  }),
  crop_yield: z.coerce.number().min(0, "Yield must be positive").nullable(),
  moisture_content: z.coerce
    .number()
    .min(0, "Moisture content must be positive")
    .max(100, "Moisture content cannot exceed 100%")
    .nullable(),
  quality_grade: z.string().nullable(),
  residue_generated: z.coerce
    .number()
    .min(0, "Residue must be positive")
    .nullable(),
  residue_storage_location: z.string().nullable(),
  storage_conditions: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.enum(["stored", "in_process", "used"]).default("stored"),
  storage_proof: z.instanceof(File).optional(),
});

export type BiomassFormValues = z.infer<typeof biomassFormSchema>;

// Type for data being sent to Supabase
export type BiomassInsertData = Omit<
  BiomassFormValues,
  "harvest_date" | "storage_proof"
> & {
  harvest_date: string; // Date as ISO string for Supabase
  storage_proof_url?: string | null;
};

// app/(dashboard)/biomass/components/biomass-form/types.ts
export interface Parcel {
  id: string;
  parcel_name: string;
}

export interface BiomassFormProps {
  parcels: Parcel[];
  initialData?: BiomassFormValues;
  isEdit?: boolean;
}
