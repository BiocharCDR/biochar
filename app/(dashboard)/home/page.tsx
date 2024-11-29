import DashboardMetrics from "@/components/home/dashboard-metrics";
import ProductionChart from "@/components/home/production-chart";
import QuickActions from "@/components/home/quick-actions";
import RecentActivities from "@/components/home/recent-activities";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch metrics data
  const { data: metrics } = await supabase
    .from("production_metrics")
    .select("*")
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  console.log(metrics);

  // Fetch recent activities
  const { data: activities } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("read", false)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.full_name}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your biochar production
          </p>
        </div>
      </div>

      <DashboardMetrics metrics={metrics} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ProductionChart farmerId={user.id} />
        </div>
        <div className="col-span-3">
          <QuickActions />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* <RecentActivities activities={activities} /> */}
        {notifications && notifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
            {/* Add Notifications Component */}
          </div>
        )}
      </div>
    </div>
  );
}
