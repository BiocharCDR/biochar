"use client";

// app/reports/_components/application-distribution.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface ApplicationDistributionProps {
  data: {
    quantity_used: number;
    parcel: {
      parcel_name: string;
    } | null;
  }[];
}

const chartConfig = {
  quantity: {
    label: "Quantity (kg)",
    color: "#0ea5e9",
  },
} satisfies ChartConfig;

export default function ApplicationDistribution({
  data,
}: ApplicationDistributionProps) {
  // Transform and aggregate data by parcel
  const aggregatedData = data.reduce((acc, curr) => {
    if (!curr.parcel) return acc;

    const existing = acc.find(
      (item) => item.parcel === curr?.parcel?.parcel_name
    );
    if (existing) {
      existing.quantity += curr.quantity_used;
    } else {
      acc.push({
        parcel: curr.parcel.parcel_name,
        quantity: curr.quantity_used,
      });
    }
    return acc;
  }, [] as { parcel: string; quantity: number }[]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Application Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={aggregatedData} margin={{ bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="parcel"
                height={60}
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis width={50} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="quantity"
                fill="var(--color-quantity)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
