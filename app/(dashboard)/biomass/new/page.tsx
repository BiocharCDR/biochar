import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { BiomassForm } from "@/components/biomass/biomass-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/biomass" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Biomass
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mt-4">
          Add New Biomass
        </h1>
        <p className="text-muted-foreground">
          Record a new biomass production entry
        </p>
      </div>
      <BiomassForm parcels={parcels || []} />
    </div>
  );
}
