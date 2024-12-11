// app/storage/new/page.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { StorageForm } from "@/components/storage/storage-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { StorageFormProps } from "@/components/storage/schema";

export const metadata: Metadata = {
  title: "Record Storage",
  description: "Record new biochar storage details",
};

export default async function NewStoragePage() {
  const supabase = createSupabaseServer();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch available biochar batches that haven't been stored yet
  // Use the RPC function to get available batches
  const { data: biocharBatches, error } = await supabase.rpc(
    "get_available_biochar_batches",
    {
      p_farmer_id: user.id,
    }
  );

  // If error in fetching data
  if (error) {
    console.error("Error fetching biochar batches:", error);
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch available biochar batches. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no batches available for storage
  if (!biocharBatches || biocharBatches.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Link href="/storage">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No Available Batches</AlertTitle>
          <AlertDescription>
            There are no completed biochar batches available for storage.
            Complete a biochar production batch first.
            <div className="mt-4">
              <Link href="/biochar/new">
                <Button>Create New Biochar Production</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Process biochar batches to include formatted information
  const processedBatches = biocharBatches.map((batch) => ({
    ...batch,
    displayName: `${batch.batch_number} - ${
      batch.biochar_weight
    }kg (Produced on ${new Date(batch.production_date).toLocaleDateString()})`,
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/storage">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mt-4">New Storage</h1>
        <p className="text-muted-foreground">
          Record new biochar storage details
        </p>
      </div>

      <StorageForm biocharBatches={processedBatches} />
    </div>
  );
}
