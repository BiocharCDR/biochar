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

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch the biomass record
  const { data: biomass, error: biomassError } = await supabase
    .from("biomass_production")
    .select("*")
    .eq("id", params.id)
    .single();

  if (biomassError || !biomass) {
    notFound();
  }

  console.log(biomass);

  // Fetch user's parcels for the form
  const { data: parcels, error: parcelsError } = await supabase
    .from("land_parcels")
    .select("id, parcel_name")
    .eq("farmer_id", user.id)
    .eq("status", "active");

  if (parcelsError) {
    console.error("Error fetching parcels:", parcelsError);
  }

  const initialData = {
    parcel_id: biomass.parcel_id,
    farmer_id: user.id,
    crop_type: biomass.crop_type,
    harvest_date: new Date(biomass.harvest_date),
    crop_yield: biomass.crop_yield,
    moisture_content: biomass.moisture_content,
    quality_grade: biomass.quality_grade,
    residue_generated: biomass.residue_generated,
    residue_storage_location: biomass.residue_storage_location,
    storage_conditions: biomass.storage_conditions,
    notes: biomass.notes,
    status: biomass.status as "stored" | "in_process" | "used", // Type assertion
    id: biomass.id,
    storage_proof_url: biomass.storage_proof_url,
  };

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

      <BiomassEditForm parcels={parcels || []} initialData={initialData} />
    </div>
  );
}
