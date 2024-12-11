// app/reports/page.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";

import MetricsCards from "@/components/reports/metrics-card";
import ProductionChart from "@/components/home/production-chart";
import InventoryStatus from "@/components/reports/inventory-status";

export const metadata: Metadata = {
  title: "Reports & Analytics",
  description: "View production and inventory reports",
};

export default async function ReportsPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch biomass production and usage
  const { data: biomassData } = await supabase
    .from("biomass_production")
    .select(
      `
      id,
      crop_type,
      biomass_quantity,
      biomass_used,
      biomass_remaining,
      created_at
    `
    )
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch biochar production and storage
  const { data: biocharData } = await supabase
    .from("biochar_production")
    .select(
      `
      id,
      batch_number,
      biomass_weight,
      biochar_weight,
      created_at,
      biochar_storage (
        quantity_stored,
        quantity_remaining
      )
    `
    )
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch fertilizer inventory and usage
  const { data: fertilizerData } = await supabase
    .from("fertilizer_inventory")
    .select(
      `
      id,
      name,
      quantity,
      fertilizer_type,
      created_at,
      fertilizer_usage (
        quantity_used
      )
    `
    )
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  console.log(fertilizerData);

  // Calculate summary metrics
  const summaryMetrics = {
    biomass: {
      total:
        biomassData?.reduce(
          (sum, item) => sum + (item.biomass_quantity || 0),
          0
        ) || 0,
      used:
        biomassData?.reduce((sum, item) => sum + (item.biomass_used || 0), 0) ||
        0,
      remaining:
        biomassData?.reduce(
          (sum, item) => sum + (item.biomass_remaining || 0),
          0
        ) || 0,
    },
    biochar: {
      produced:
        biocharData?.reduce(
          (sum, item) => sum + (item.biochar_weight || 0),
          0
        ) || 0,
      stored:
        biocharData?.reduce(
          (sum, item) => sum + (item?.biochar_storage?.quantity_remaining || 0),
          0
        ) || 0,
    },
    fertilizer: {
      total: fertilizerData?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      used:
        fertilizerData?.reduce(
          (sum, item) =>
            sum +
            (item.fertilizer_usage?.reduce(
              (usageSum, usage) => usageSum + usage.quantity_used,
              0
            ) || 0),
          0
        ) || 0,
    },
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          View your production and inventory metrics
        </p>
      </div>
      <Separator />

      {/* Overview Metrics */}
      <MetricsCards metrics={summaryMetrics} />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* <ProductionChart
          biomassData={biomassData || []}
          biocharData={biocharData || []}
        /> */}
        <InventoryStatus
          biomassData={biomassData || []}
          biocharData={biocharData || []}
          fertilizerData={fertilizerData || []}
        />
      </div>
    </div>
  );
}
