"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/supabase/schema";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ProductionTrendProps {
  data: Tables<"production_metrics">[];
}

const chartConfig = {
  biochar: {
    label: "Biochar (kg)",
    color: "#0ea5e9",
  },
  biomass: {
    label: "Biomass (kg)",
    color: "#84cc16",
  },
  yield: {
    label: "Yield (%)",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export default function ProductionTrend({ data }: ProductionTrendProps) {
  const chartData = data.map((record) => ({
    month: format(new Date(record.month), "MMM yy"),
    biochar: record.total_biochar_produced || 0,
    biomass: record.total_biomass_produced || 0,
    yield: record.average_yield_percentage || 0,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Production Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" height={40} tick={{ fontSize: 12 }} />
              <YAxis width={50} />
              <Tooltip />
              <Legend />
              <Bar dataKey="biochar" fill="var(--color-biochar)" barSize={20} />
              <Bar dataKey="biomass" fill="var(--color-biomass)" barSize={20} />
              <Bar dataKey="yield" fill="var(--color-yield)" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
