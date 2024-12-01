import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { BiomassDetails } from "@/components/biomass/biomass-details";
import { BiomassSummary } from "@/components/biomass/biomass-summary";
import { StorageDetails } from "@/components/biomass/storage-details";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BiomassDetailsPageProps {
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

  if (error || !biomass) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        {/* <BackButton /> */}
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <BiomassDetails data={biomass} />

        {/* Storage Information */}
        <StorageDetails data={biomass} />
      </div>
    </div>
  );
}
