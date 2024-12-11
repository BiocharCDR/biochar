/* eslint-disable */
// app/storage/[id]/edit/page.tsx
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { StorageForm } from "@/components/storage/storage-form";
import {
  QualityParameters,
  StorageFormValues,
} from "@/components/storage/schema";

export const metadata: Metadata = {
  title: "Edit Storage",
  description: "Edit storage record details",
};

export default async function EditStoragePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServer();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch storage record with biochar details
  const { data: storage } = await supabase
    .from("biochar_storage")
    .select(
      `
      *,
      biochar:biochar_production (
        id,
        batch_number,
        biochar_weight,
        production_date
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (!storage || !storage.biochar) {
    notFound();
  }

  const qualityParameters =
    storage.quality_parameters as QualityParameters | null;

  const initialData: Partial<StorageFormValues> = {
    biochar_id: storage.biochar_id,
    storage_location: storage.storage_location,
    storage_date: new Date(storage.storage_date),
    quantity_stored: storage.quantity_stored,
    storage_conditions: storage.storage_conditions,
    quality_check_date: storage.quality_check_date
      ? new Date(storage.quality_check_date)
      : null,
    status: storage.status as "stored" | "in_use" | "depleted",
    quality_parameters: qualityParameters
      ? {
          ph_level: qualityParameters.ph_level,
          moisture_content: qualityParameters.moisture_content,
          carbon_content: qualityParameters.carbon_content,
          ash_content: qualityParameters.ash_content,
        }
      : null,
  };

  // Fetch all biochar batches for the form
  const { data: biocharBatches } = await supabase
    .from("biochar_production")
    .select(
      `
    id,
    batch_number,
    biochar_weight,
    production_date
  `
    )
    .eq("farmer_id", user.id)
    .eq("status", "completed")
    .not("biochar_weight", "is", null)
    .order("production_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Storage Record</h3>
        <p className="text-sm text-muted-foreground">
          Update storage details for batch #{storage.biochar.batch_number}
        </p>
      </div>
      <StorageForm
        biocharBatches={biocharBatches as any}
        initialData={initialData}
        isEdit={true}
      />
    </div>
  );
}
