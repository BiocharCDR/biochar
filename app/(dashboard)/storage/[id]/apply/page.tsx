// app/storage/[id]/apply/page.tsx
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ApplicationForm } from "@/components/storage/application-form";
import { StorageWithBiochar } from "@/components/storage/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Record Application",
  description: "Record biochar application to land",
};

export default async function ApplyPage({
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
  const { data: storage, error: storageError } = await supabase
    .from("biochar_storage")
    .select(
      `
      *,
      biochar:biochar_production (
        batch_number
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (storageError || !storage) {
    notFound();
  }

  // Fetch available land parcels
  const { data: parcels, error: parcelsError } = await supabase
    .from("land_parcels")
    .select("id, parcel_name")
    .eq("farmer_id", user.id)
    .eq("status", "active")
    .order("parcel_name");

  const { data: fertilizers } = await supabase
    .from("fertilizer_inventory")
    .select("*")
    .eq("farmer_id", user.id)
    .gt("quantity", 0) // Only get fertilizers with available quantity
    .eq("status", "in_stock")
    .order("name");

  const typedStorage = storage as StorageWithBiochar;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/storage" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Storage
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mt-4">
          Record Application
        </h1>
        <p className="text-muted-foreground">
          Record biochar application to land for batch #
          {storage?.biochar?.batch_number}
        </p>
      </div>
      <ApplicationForm
        storage={typedStorage}
        parcels={parcels || []}
        fertilizers={fertilizers || []}
      />
    </div>
  );
}
