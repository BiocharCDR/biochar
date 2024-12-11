// app/home/page.tsx
import { Suspense } from "react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import ProductionChart from "@/components/home/production-chart";

import DashboardMetrics from "@/components/home/dashboard-metrics";
import QuickActions from "@/components/home/quick-actions";
import StockStatus from "@/components/home/stock-status";

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
    { data: notifications },
    { data: landParcels },
    { data: biomassRecords },
    { data: biocharRecords },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("production_metrics")
      .select("*")
      .eq("farmer_id", user.id)
      .order("month", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("land_parcels").select("*").eq("farmer_id", user.id),
    supabase.from("biomass_production").select("*").eq("farmer_id", user.id),
    supabase
      .from("biochar_production")
      .select(
        `
        *,
        biochar_storage (
          quantity_stored,
          quantity_remaining
        )
      `
      )
      .eq("farmer_id", user.id),
  ]);

  const showGuide =
    !landParcels?.length || !biomassRecords?.length || !biocharRecords?.length;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, {profile?.full_name}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Here&apos;s your production overview
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-6">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-4">
          {/* Metrics */}
          <DashboardMetrics metrics={metrics} />

          {/* Production Chart */}
          <Suspense fallback={<ChartSkeleton />}>
            <ProductionChart farmerId={user.id} />
          </Suspense>
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6 lg:col-span-2">
          <StockStatus
            biomassRecords={biomassRecords}
            biocharRecords={biocharRecords}
          />

          <QuickActions
            showGuide={showGuide}
            hasBiomassRecords={!!biomassRecords?.length}
          />
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card h-[350px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
