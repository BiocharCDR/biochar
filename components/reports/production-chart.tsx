/* eslint-disable */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProductionChartProps {
  biomassData: any[];
  biocharData: any[];
}

export default function ProductionChart({
  biomassData,
  biocharData,
}: ProductionChartProps) {
  // Process data for chart
  const chartData = biocharData.map((biochar) => {
    const date = format(new Date(biochar.created_at), "MMM yy");
    return {
      date,
      biomassUsed: biochar.biomass_weight || 0,
      biocharProduced: biochar.biochar_weight || 0,
      conversionRate:
        biochar.biochar_weight && biochar.biomass_weight
          ? ((biochar.biochar_weight / biochar.biomass_weight) * 100).toFixed(1)
          : 0,
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Production Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                height={60}
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="biomassUsed"
                name="Biomass Used (kg)"
                stroke="#84cc16"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="biocharProduced"
                name="Biochar Produced (kg)"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversionRate"
                name="Conversion Rate (%)"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
