/* eslint-disable*/
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductionChartProps {
  farmerId: string;
}

export default function ProductionChart({ farmerId }: ProductionChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [view, setView] = useState("daily");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchProductionData() {
      const { data: production } = await supabase
        .from("biochar_production")
        .select(
          `
          production_date,
          biochar_weight,
          biomass_weight,
          yield_percentage
        `
        )
        .eq("farmer_id", farmerId)
        .order("production_date", { ascending: true });

      if (production) {
        const processedData = production.map((item) => ({
          date: format(parseISO(item.production_date), "MMM dd"),
          biochar: item.biochar_weight || 0,
          biomass: item.biomass_weight || 0,
          yield: item.yield_percentage || 0,
        }));

        if (view === "weekly") {
          // Group by week and calculate averages
          // Add weekly aggregation logic here
        }

        setData(processedData);
      }
    }

    fetchProductionData();
  }, [farmerId, view]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
              {entry.name === "yield" ? "%" : "kg"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Production Trends</CardTitle>
          <Tabs
            value={view}
            onValueChange={setView}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
                axisLine={{ stroke: "hsl(var(--muted))" }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
                axisLine={{ stroke: "hsl(var(--muted))" }}
                label={{
                  value: "Amount (kg)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
                axisLine={{ stroke: "hsl(var(--muted))" }}
                label={{
                  value: "Yield (%)",
                  angle: 90,
                  position: "insideRight",
                  fontSize: 12,
                }}
              />
              <Tooltip content={CustomTooltip} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="biomass"
                name="Biomass Used"
                stroke="#84cc16"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="biochar"
                name="Biochar Produced"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yield"
                name="Yield Rate"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
