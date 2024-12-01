import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

import { createSupabaseServer } from "@/lib/supabase/server";
import { StatsCards } from "@/components/biochar/stat-cards";
import { DataTable } from "@/components/biochar/data-table";
import { columns } from "@/components/biochar/columns";
import {
  BiocharProduction,
  BiocharProductionWithRelations,
} from "@/components/biochar/types";

export default async function BiocharPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch biochar production records with relations
  const { data } = await supabase
    .from("biochar_production")
    .select(
      `
      *,
      biomass:biomass_id (
        id,
        crop_type
      ),
      storage:biochar_storage (
        id,
        storage_location,
        quantity_stored,
        status
      )
    `
    )
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  // Type assertion after we know the shape matches
  const biocharRecords = data as unknown as BiocharProduction[];
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Biochar Production
          </h1>
          <p className="text-muted-foreground">
            Manage your biochar production and storage
          </p>
        </div>
        <Link href="/biochar/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Production
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <StatsCards data={biocharRecords || []} />
      </div>

      {/* Filter by Biomass */}
      {/* <div className="mb-4">
        <BiomassSelect userId={user.id} />
      </div> */}

      {/* Production Records Table */}
      <DataTable columns={columns} data={biocharRecords || []} />
    </div>
  );
}
