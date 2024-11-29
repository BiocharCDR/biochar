"use client";
// app/(main)/home/components/production-chart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface ProductionChartProps {
  farmerId: string;
}

export default function ProductionChart({ farmerId }: ProductionChartProps) {
  const [data, setData] = useState([]);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchProductionData() {
      const { data: production } = await supabase
        .from("biochar_production")
        .select("production_date, biochar_weight")
        .eq("farmer_id", farmerId)
        .order("production_date", { ascending: true })
        .limit(10);

      if (production) {
        const chartData = production.map((item) => ({
          date: new Date(item.production_date).toLocaleDateString(),
          amount: item.biochar_weight,
        }));
        setData(chartData as any);
      }
    }

    fetchProductionData();
  }, [farmerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: "Biochar (kg)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
