import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { StatsCards } from "@/components/biomass/stats-card";

import { DataTable } from "@/components/biomass/data-table";
import { columns } from "@/components/biomass/columns";
import { Database } from "@/supabase/schema";
import { BiomassProductionWithParcelName } from "@/components/biomass/types";
import { BiomassProduction } from "@/types";

export default async function BiomassPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch biomass production records with parcel information
  const { data: biomassRecords } = await supabase
    .from("biomass_production")
    .select(
      `
      *,
      land_parcels (
        parcel_name
      )
    `
    )
    .order("created_at", { ascending: false });

  const typedRecords = biomassRecords as BiomassProductionWithParcelName[];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Biomass Production
          </h1>
          <p className="text-muted-foreground">
            Manage your biomass production and storage
          </p>
        </div>
        <Link href="/biomass/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Biomass
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards data={biomassRecords as BiomassProduction[]} />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={biomassRecords as BiomassProductionWithParcelName[]}
      />
    </div>
  );
}
