/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  TreeDeciduous,
  Factory,
  Scale,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, CartesianGrid, Line, XAxis } from "recharts";

import { formatDistanceToNow } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface FarmerOverviewProps {
  farmerId: string;
}

export function FarmerOverview({ farmerId }: FarmerOverviewProps) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchStats() {
      // Fetch production metrics
      const { data: metrics } = await supabase
        .from("production_metrics")
        .select("*")
        .eq("farmer_id", farmerId)
        .order("month", { ascending: false })
        .limit(6);

      // Fetch recent production
      const { data: recentProduction } = await supabase
        .from("biochar_production")
        .select("*")
        .eq("farmer_id", farmerId)
        .order("production_date", { ascending: false })
        .limit(5);

      // Calculate trends
      const monthlyTrend =
        metrics && metrics.length >= 2
          ? (
              ((metrics[0].total_biochar_produced! -
                metrics[1].total_biochar_produced!) /
                metrics[1].total_biochar_produced!) *
              100
            ).toFixed(1)
          : 0;

      setStats({
        metrics: metrics || [],
        recentProduction: recentProduction || [],
        monthlyTrend: Number(monthlyTrend),
      });
      setIsLoading(false);
    }

    fetchStats();
  }, [farmerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        Loading...
      </div>
    );
  }

  const chartConfig = {
    biochar: {
      label: "Biochar Production",
      color: "hsl(var(--chart-1))",
    },
    biomass: {
      label: "Biomass Used",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const formattedMetrics = stats.metrics
    .map((metric: any) => ({
      month: new Date(metric.month).toLocaleString("default", {
        month: "long",
      }),
      biochar: metric.total_biochar_produced,
      biomass: metric.total_biomass_produced,
    }))
    .reverse();

  return (
    <div className="grid gap-4">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Biochar Produced
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.metrics[0]?.total_biochar_produced || 0}kg
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyTrend > 0 ? "+" : ""}
              {stats.monthlyTrend}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.metrics[0]?.average_yield_percentage || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Biochar production efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Biomass Utilization
            </CardTitle>
            <TreeDeciduous className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.metrics[0]?.total_biomass_produced || 0}kg
            </div>
            <p className="text-xs text-muted-foreground">
              Total biomass processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Production Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Production History</CardTitle>
          <CardDescription>
            Monthly biochar and biomass tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <LineChart
                data={formattedMetrics}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="biochar"
                  type="natural"
                  stroke="var(--color-biochar)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="biomass"
                  type="natural"
                  stroke="var(--color-biomass)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {stats.monthlyTrend > 0 ? (
              <>
                Trending up by {stats.monthlyTrend}% this month
                <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : (
              <>
                Trending down by {Math.abs(stats.monthlyTrend)}% this month
                <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Recent Production */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Production</CardTitle>
          <CardDescription>Latest biochar production batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {stats.recentProduction.length > 0 ? (
              stats.recentProduction.map((item: any) => (
                <div key={item.id} className="flex items-center">
                  <TreeDeciduous className="h-9 w-9 text-blue-500" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">
                      Batch #{item.batch_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.biochar_weight}kg biochar from {item.biomass_weight}
                      kg biomass
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium">
                      {item.yield_percentage}% yield
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.production_date), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No recent production data
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
