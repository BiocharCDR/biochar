import AdminDashboard from "@/components/admin/admin-dashboard";
import supabaseAdmin from "@/lib/supabase/admin";

export const metadata = {
  title: "Admin Dashboard",
  description: "Overview of biochar production system",
};

export default async function AdminPage() {
  const supabase = supabaseAdmin();

  // Get total farmers count
  const { count: totalFarmers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "farmer");

  // Get total parcels count
  const { count: totalParcels } = await supabase
    .from("land_parcels")
    .select("*", { count: "exact", head: true });

  // Get biochar production stats
  const { data: productionStats } = await supabase
    .from("biochar_production")
    .select("biochar_weight, biomass_weight, yield_percentage");

  // Calculate totals and averages
  const totalBiocharProduced = productionStats?.reduce(
    (sum, record) => sum + (record.biochar_weight || 0),
    0
  );
  const averageYield = productionStats
    ? productionStats.reduce(
        (sum, record) => sum + (record.yield_percentage || 0),
        0
      ) / (productionStats.length || 1)
    : 0;

  // Get recent production data
  const { data: recentProduction } = await supabase
    .from("biochar_production")
    .select("*")
    .order("production_date", { ascending: false })
    .limit(5);

  const dashboardData = {
    totalFarmers: totalFarmers || 0,
    totalParcels: totalParcels || 0,
    totalBiocharProduced: Math.round(totalBiocharProduced || 0),
    averageYield: Math.round(averageYield),
    recentProduction: recentProduction || [],
  };

  return (
    <AdminDashboard
      averageYield={dashboardData.averageYield}
      recentProduction={dashboardData.recentProduction}
      totalBiocharProduced={dashboardData.totalBiocharProduced}
      totalFarmers={dashboardData.totalFarmers}
      totalParcels={dashboardData.totalParcels}
    />
  );
}
