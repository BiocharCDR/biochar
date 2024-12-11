import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { createSupabaseServer } from "@/lib/supabase/server";
import ApplicationHistory from "@/components/storage/application-history";
import StorageDetailHeader from "@/components/storage/storage-detail-header";
import StorageInfo from "@/components/storage/storage-info-component";
import {
  BiocharApplication,
  StorageWithBiochar,
} from "@/components/storage/types";

export const metadata: Metadata = {
  title: "Storage Details",
  description: "View storage record details",
};

export default async function StorageDetailPage({
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

  // Fetch storage record with biochar production details
  const { data: storage, error: storageError } = await supabase
    .from("biochar_storage")
    .select(
      `
      *,
      biochar:biochar_production (
        batch_number,
        biochar_weight,
        production_date,
        farmer_id
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (storageError || !storage || !storage.biochar) {
    notFound();
  }

  // Fetch application history
  const { data: applications } = await supabase
    .from("biochar_application")
    .select(
      `
      *,
      parcel:land_parcels (
        parcel_name
      )
    `
    )
    .eq("storage_id", storage.id)
    .order("application_date", { ascending: false });

  // Filter out any applications where parcel is null
  const validApplications = (applications || []).filter(
    (app): app is BiocharApplication => app.parcel !== null
  );

  const typedStorage = storage as StorageWithBiochar;

  return (
    <div className="space-y-6">
      <StorageDetailHeader storage={typedStorage} />
      <Separator />
      <div className="grid gap-6 md:grid-cols-2">
        <StorageInfo storage={typedStorage} />
        <ApplicationHistory applications={validApplications} />
      </div>
    </div>
  );
}
