// app/home/page.tsx
import DashboardMetrics from "@/components/home/dashboard-metrics";
import ProductionChart from "@/components/home/production-chart";
import QuickActions from "@/components/home/quick-actions";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell } from "lucide-react";
import FarmerProgressGuide from "@/components/home/farmer-progress-guide";

export default async function HomePage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch all required data
  const [
    { data: profile },
    { data: metrics },
    { data: activities },
    { data: notifications },
    { data: landParcels },
    { data: biomassRecords },
    { data: biocharRecords },
    { data: fertilizerRecords },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("production_metrics")
      .select("*")
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("land_parcels").select("*").eq("farmer_id", user.id),
    supabase.from("biomass_production").select("*").eq("farmer_id", user.id),
    supabase.from("biochar_production").select("*").eq("farmer_id", user.id),
    supabase.from("fertilizer_inventory").select("*").eq("farmer_id", user.id),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.full_name}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your biochar production
          </p>
        </div>
      </div>

      {/* Show notifications if any */}
      {notifications && notifications.length > 0 && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>Notifications</AlertTitle>
          <AlertDescription>
            You have {notifications.length} unread notifications.
            {/* We can add a link to notifications page here */}
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Guide for New Farmers */}
      {(!landParcels?.length ||
        !biomassRecords?.length ||
        !biocharRecords?.length ||
        !fertilizerRecords?.length) && (
        <FarmerProgressGuide
          profile={profile}
          hasLandParcels={Boolean(landParcels?.length)}
          hasBiomassRecords={Boolean(biomassRecords?.length)}
          hasBiocharProduction={Boolean(biocharRecords?.length)}
          hasFertilizerRecords={Boolean(fertilizerRecords?.length)}
        />
      )}

      {/* Dashboard Metrics */}
      <DashboardMetrics metrics={metrics} />

      {/* Production Chart and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ProductionChart farmerId={user.id} />
        </div>
        <div className="col-span-3">
          <QuickActions
            showGuide={!landParcels?.length}
            hasBiomassRecords={Boolean(biomassRecords?.length)}
          />
        </div>
      </div>
    </div>
  );
}
