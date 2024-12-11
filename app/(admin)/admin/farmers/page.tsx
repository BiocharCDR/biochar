import { FarmersClient } from "@/components/admin/farmers/farmers-client";
import supabaseAdmin from "@/lib/supabase/admin";

export const metadata = {
  title: "Farmers Management",
  description: "Manage registered farmers and their details",
};

export default async function FarmersPage() {
  const supabase = supabaseAdmin();

  const { data: farmers } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      phone_number,
      address,
      created_at,
      land_parcels (
        id
      )
    `
    )
    .eq("role", "farmer")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Farmers</h2>
          <p className="text-muted-foreground">
            Manage and view registered farmers
          </p>
        </div>
      </div>
      <FarmersClient data={farmers || []} />
    </div>
  );
}
