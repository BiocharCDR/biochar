// app/(dashboard)/parcels/page.tsx
import { notFound, redirect } from "next/navigation";
import AddParcelDialog from "@/components/parcels/add-parcel-dialog";
import { columns } from "@/components/parcels/columns";
import { DataTable } from "@/components/parcels/data-table";
import { Parcel } from "@/components/parcels/types";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ParcelsPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Then get parcels
  const { data, error } = await supabase
    .from("land_parcels")
    .select(`*`)
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching parcels:", error);
    notFound();
  }

  // Transform the data to match our Parcel type
  const parcels: Parcel[] =
    data?.map((parcel) => ({
      ...parcel,
      profiles: userProfile,
    })) || [];

  if (error) {
    console.error("Error fetching parcels:", error);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Land Parcels</h1>
          <p className="text-muted-foreground">
            Manage your registered land parcels here
          </p>
        </div>
        <Button asChild>
          <Link href="/parcels/new">+ Add Parcel</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="p-4 bg-card text-card-foreground rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Total Parcels
          </div>
          <div className="text-2xl font-bold">{parcels.length}</div>
        </div>
        <div className="p-4 bg-card text-card-foreground rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Total Area
          </div>
          <div className="text-2xl font-bold">
            {parcels
              .reduce((sum, parcel) => sum + (parcel.total_area || 0), 0)
              .toFixed(2)}{" "}
            ha
          </div>
        </div>
        <div className="p-4 bg-card text-card-foreground rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Cultivable Area
          </div>
          <div className="text-2xl font-bold">
            {parcels
              .reduce((sum, parcel) => sum + (parcel.cultivable_area || 0), 0)
              .toFixed(2)}{" "}
            ha
          </div>
        </div>
        <div className="p-4 bg-card text-card-foreground rounded-lg border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Active Parcels
          </div>
          <div className="text-2xl font-bold">
            {parcels.filter((parcel) => parcel.status === "active").length}
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={parcels} />
    </div>
  );
}
