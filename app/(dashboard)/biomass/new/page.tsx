import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { BiomassForm } from "@/components/biomass/biomass-form";

export default async function NewBiomassPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's parcels for the form
  const { data: parcels } = await supabase
    .from("land_parcels")
    .select("id, parcel_name")
    .eq("farmer_id", user.id)
    .eq("status", "active");

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Biomass</h1>
        <p className="text-muted-foreground">
          Record a new biomass production entry
        </p>
      </div>
      <BiomassForm parcels={parcels || []} />
    </div>
  );
}
