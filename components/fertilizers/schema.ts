// app/fertilisers/_components/schema.ts
import { Tables } from "@/supabase/schema";
import * as z from "zod";

// Base fertilizer form schema
export const fertilizerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fertilizer_type: z.enum(["chemical", "organic"]),
  manufacturer: z.string().nullable(),
  batch_number: z.string().nullable(),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  purchase_date: z.date(),
  purchase_proof: z.instanceof(File).optional().nullable(),
  status: z.enum(["in_stock", "low_stock", "out_of_stock"]).default("in_stock"),
});

// Type for the form values
export type FertilizerFormValues = z.infer<typeof fertilizerFormSchema>;

// Extending the form values to include database fields
export interface FertilizerData
  extends Omit<Tables<"fertilizer_inventory">, "purchase_date"> {
  purchase_date: Date;
}

// Props for the form component
export interface FertilizerFormProps {
  initialData?: Partial<FertilizerFormValues> & Partial<FertilizerData>;
  isEdit?: boolean;
}

export const FERTILIZER_TYPES = [
  { label: "Chemical", value: "chemical" },
  { label: "Organic", value: "organic" },
] as const;

export const FERTILIZER_UNITS = [
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Liters (L)", value: "L" },
] as const;

export const FERTILIZER_STATUS = [
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
] as const;

export type initialDataType = Partial<FertilizerFormValues> &
  Partial<FertilizerData>;

export const fertilizerUsageFormSchema = z.object({
  parcel_id: z.string().min(1, "Land parcel is required"),
  application_date: z.date(),
  quantity_used: z.number().positive("Quantity must be greater than 0"),
  purpose: z.string().nullable(),
  notes: z.string().nullable(),
});

export type FertilizerUsageFormValues = z.infer<
  typeof fertilizerUsageFormSchema
>;

export interface FertilizerUsageFormProps {
  fertilizer: Tables<"fertilizer_inventory">;
  landParcels: Tables<"land_parcels">[];
  initialData?: Partial<FertilizerUsageFormValues> & { id?: string };
  isEdit?: boolean;
}
