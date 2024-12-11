"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface QualityChartProps {
  data: {
    quality_parameters: {
      ph_level: number | null;
      moisture_content: number | null;
      carbon_content: number | null;
      ash_content: number | null;
    } | null;
    storage_date: string;
  }[];
}

const chartConfig = {
  ph: {
    label: "pH Level",
    color: "#0ea5e9",
  },
  moisture: {
    label: "Moisture %",
    color: "#84cc16",
  },
  carbon: {
    label: "Carbon %",
    color: "#f59e0b",
  },
  ash: {
    label: "Ash %",
    color: "#dc2626",
  },
} satisfies ChartConfig;

export default function QualityChart({ data }: QualityChartProps) {
  const chartData = data
    .filter((record) => record.quality_parameters)
    .map((record) => ({
      date: format(new Date(record.storage_date), "MMM dd"),
      ph: record.quality_parameters?.ph_level || 0,
      moisture: record.quality_parameters?.moisture_content || 0,
      carbon: record.quality_parameters?.carbon_content || 0,
      ash: record.quality_parameters?.ash_content || 0,
    }))
    .reverse();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quality Parameters Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                height={60}
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis width={50} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ph" fill="var(--color-ph)" barSize={20} />
              <Bar
                dataKey="moisture"
                fill="var(--color-moisture)"
                barSize={20}
              />
              <Bar dataKey="carbon" fill="var(--color-carbon)" barSize={20} />
              <Bar dataKey="ash" fill="var(--color-ash)" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        {chartData.length === 0 && (
          <div className="flex items-center justify-center h-[350px] text-sm text-muted-foreground">
            No quality data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
