import { BiomassDetails } from "@/components/biomass/biomass-details";
import { BiomassSummary } from "@/components/biomass/biomass-summary";
import { BiomassUsage } from "@/components/biomass/biomass-usage";
import { StorageDetails } from "@/components/biomass/storage-details";
import { Button } from "@/components/ui/button";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export interface BiomassDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function BiomassDetailsPage({
  params,
}: BiomassDetailsPageProps) {
  const supabase = createSupabaseServer();

  // Fetch biomass record with parcel information
  const { data: biomass, error } = await supabase
    .from("biomass_production")
    .select(
      `
      *,
      land_parcels (
        id,
        parcel_name,
        total_area,
        cultivable_area
      )
    `
    )
    .eq("id", params.id)
    .single();

  // Fetch Biomass Usage Records
  const { data: biomassUsage, error: usageError } = await supabase
    .from("biomass_usage")
    .select(
      `
      id,
      biomass_id,
      quantity_used,
      usage_date,
      created_at,
      updated_at,
      biochar_production (
        id,
        batch_number,
        biochar_weight,
        biomass_weight,
        combustion_temperature,
        end_time,
        production_date,
        start_time,
        yield_percentage
      )
    `
    )
    .eq("biomass_id", params.id);

  if (error || !biomass) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/biomass" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Biomass
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mt-4">
          Biomass Details
        </h1>
        <p className="text-muted-foreground">
          View detailed information about this biomass record
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8">
        <BiomassSummary data={biomass} />
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <BiomassDetails data={biomass} />

          {/* Storage Information */}
          <StorageDetails data={biomass} />
        </div>

        {/* Usage History - Full Width */}
        <div className="col-span-full">
          <BiomassUsage data={biomassUsage || []} />
        </div>
      </div>
    </div>
  );
}
