import { notFound } from "next/navigation";
import supabaseAdmin from "@/lib/supabase/admin";
import { FarmerProfile } from "@/components/admin/farmers/farmer-profile";
import { FarmerTabs } from "@/components/admin/farmers/farmers-tab";

interface FarmerDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function FarmerDetailsPage({
  params,
}: FarmerDetailsPageProps) {
  const supabase = supabaseAdmin();

  const { data: farmer } = await supabase
    .from("profiles")
    .select(
      `
      *,
      land_parcels (
        id
      )
    `
    )
    .eq("id", params.id)
    .eq("role", "farmer")
    .single();

  if (!farmer) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <FarmerProfile farmer={farmer} />
      <FarmerTabs farmerId={farmer.id} />
    </div>
  );
}
