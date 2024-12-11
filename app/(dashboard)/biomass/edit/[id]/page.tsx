import { notFound } from "next/navigation";

import { createSupabaseServer } from "@/lib/supabase/server";
import { BiomassForm } from "@/components/biomass/biomass-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BiomassEditForm } from "@/components/biomass/edit-form";

interface EditBiomassPageProps {
  params: {
    id: string;
  };
}

export default async function EditBiomassPage({
  params,
}: EditBiomassPageProps) {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch the biomass record with all fields
  const { data: biomass, error: biomassError } = await supabase
    .from("biomass_production")
    .select("*")
    .eq("id", params.id)
    .single();

  if (biomassError || !biomass) {
    notFound();
  }

  // Fetch user's parcels
  const { data: parcels, error: parcelsError } = await supabase
    .from("land_parcels")
    .select("id, parcel_name")
    .eq("farmer_id", user.id)
    .eq("status", "active");

  if (parcelsError) {
    console.error("Error fetching parcels:", parcelsError);
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
        <h1 className="text-3xl font-bold tracking-tight mt-4">Edit Biomass</h1>
        <p className="text-muted-foreground">
          Update the details of your biomass record
        </p>
      </div>

      <BiomassEditForm parcels={parcels || []} initialData={biomass} />
    </div>
  );
}
