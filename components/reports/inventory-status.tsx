/* eslint-disable */

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InventoryStatusProps {
  biomassData: any[];
  biocharData: any[];
  fertilizerData: any[];
}

export default function InventoryStatus({
  biomassData,
  biocharData,
  fertilizerData,
}: InventoryStatusProps) {
  // Process data for the chart
  const inventoryData = [
    {
      category: "Biomass",
      total: biomassData.reduce(
        (sum, item) => sum + (item.biomass_quantity || 0),
        0
      ),
      used: biomassData.reduce(
        (sum, item) => sum + (item.biomass_used || 0),
        0
      ),
      remaining: biomassData.reduce(
        (sum, item) => sum + (item.biomass_remaining || 0),
        0
      ),
    },
    {
      category: "Biochar",
      total: biocharData.reduce(
        (sum, item) => sum + (item.biochar_weight || 0),
        0
      ),
      used: biocharData.reduce(
        (sum, item) =>
          sum +
          ((item.biochar_weight || 0) -
            (item.biochar_storage?.[0]?.quantity_remaining || 0)),
        0
      ),
      remaining: biocharData.reduce(
        (sum, item) =>
          sum + (item.biochar_storage?.[0]?.quantity_remaining || 0),
        0
      ),
    },
    {
      category: "Fertilizer",
      total: fertilizerData.reduce((sum, item) => sum + item.quantity, 0),
      used: fertilizerData.reduce(
        (sum, item) =>
          sum +
          (item.fertilizer_usage?.reduce(
            (usageSum: any, usage: any) => usageSum + usage.quantity_used,
            0
          ) || 0),
        0
      ),
      remaining: fertilizerData.reduce(
        (sum, item) =>
          sum +
          (item.quantity -
            (item.fertilizer_usage?.reduce(
              (usageSum: any, usage: any) => usageSum + usage.quantity_used,
              0
            ) || 0)),
        0
      ),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Inventory Status</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total"
                name="Total"
                fill="#84cc16"
                stackId="a"
                barSize={20}
              />
              <Bar
                dataKey="used"
                name="Used"
                fill="#0ea5e9"
                stackId="a"
                barSize={20}
              />
              <Bar
                dataKey="remaining"
                name="Remaining"
                fill="#f59e0b"
                stackId="a"
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
