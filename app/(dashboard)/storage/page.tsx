// app/storage/page.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import StorageHeader from "@/components/storage/storage-header";
import StorageTable from "@/components/storage/storage-table";

export const metadata: Metadata = {
  title: "Storage Management",
  description: "Manage your biochar storage and applications",
};

export default async function StoragePage() {
  const supabase = createSupabaseServer();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch storage records with biochar production details
  const { data: storageRecords } = await supabase.from("biochar_storage")
    .select(`
      *,
      biochar:biochar_production (
        batch_number
      )
    `);

  return (
    <div className="space-y-6">
      <StorageHeader />
      <StorageTable data={storageRecords || []} />
    </div>
  );
}
