/* eslint-disable */
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BiocharForm } from "@/components/biochar/biochar-form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default async function NewBiocharPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch available biomass records with remaining quantities
  const { data: biomassRecords, error: biomassError } = await supabase
    .from("biomass_production")
    .select(
      `
      id,
      crop_type,
      harvest_date,
      biomass_quantity,
      biomass_used,
      biomass_remaining,
      status,
      land_parcels (
        parcel_name
      )
    `
    )
    .eq("status", "stored")
    .eq("farmer_id", user.id)
    .gt("biomass_remaining", 0) // Only fetch biomass with remaining quantity
    .order("harvest_date", { ascending: false });

  // Handle database error
  if (biomassError) {
    console.error("Error fetching biomass records:", biomassError);
    // You might want to handle this error differently
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch biomass records. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if there are any available biomass records
  if (!biomassRecords || biomassRecords.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Link href="/biochar">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>No Available Biomass</AlertTitle>
              <AlertDescription>
                You need to have stored biomass before you can start biochar
                production.
                <div className="mt-4">
                  <Link href="/biomass/new">
                    <Button>Add New Biomass</Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Process biomass records to include formatted information
  const processedBiomassRecords = biomassRecords.map((record) => ({
    ...record,
    displayName: `${record.crop_type} from ${
      record.land_parcels?.parcel_name || "Unknown Parcel"
    } - ${record.biomass_remaining!.toFixed(2)}kg available`,
    harvestDate: new Date(record.harvest_date),
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/biochar">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mt-4">
          New Biochar Production
        </h1>
        <p className="text-muted-foreground">
          Record a new biochar production batch
        </p>
      </div>

      <BiocharForm biomassRecords={processedBiomassRecords as any} />
    </div>
  );
}
