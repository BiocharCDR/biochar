// app/home/stock-status.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/supabase/schema";
import { Progress } from "@/components/ui/progress";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StockStatusProps {
  biomassRecords: Tables<"biomass_production">[] | null;
  biocharRecords:
    | {
        id: string;
        biochar_weight: number | null;
        biochar_storage: {
          quantity_stored: number;
          quantity_remaining: number;
        } | null;
      }[]
    | null;
}

export default function StockStatus({
  biomassRecords,
  biocharRecords,
}: StockStatusProps) {
  // Calculate total biomass statistics
  const biomassStats = biomassRecords?.reduce(
    (acc, curr) => ({
      total: acc.total + (curr.biomass_quantity || 0),
      used: acc.used + (curr.biomass_used || 0),
      remaining: acc.remaining + (curr.biomass_remaining || 0),
    }),
    { total: 0, used: 0, remaining: 0 }
  ) || { total: 0, used: 0, remaining: 0 };

  // Calculate total biochar statistics
  const biocharStats = biocharRecords?.reduce(
    (acc, curr) => ({
      total: acc.total + (curr.biochar_weight || 0),
      stored: acc.stored + (curr.biochar_storage?.quantity_stored || 0),
      remaining:
        acc.remaining + (curr.biochar_storage?.quantity_remaining || 0),
    }),
    { total: 0, stored: 0, remaining: 0 }
  ) || { total: 0, stored: 0, remaining: 0 };

  const items = [
    {
      title: "Biomass Stock",
      total: biomassStats.total,
      used: biomassStats.used,
      available: biomassStats.remaining,
      unit: "kg",
      tooltip: "Total biomass available for biochar production",
    },
    {
      title: "Biochar Stock",
      total: biocharStats.stored,
      used: biocharStats.stored - biocharStats.remaining,
      available: biocharStats.remaining,
      unit: "kg",
      tooltip: "Current biochar in storage",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          Current Stock
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Current inventory status</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {items.map((item) => (
          <div key={item.title} className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">{item.title}</div>
              <div className="text-muted-foreground">
                {item.available.toLocaleString()} /{" "}
                {item.total.toLocaleString()} {item.unit}
              </div>
            </div>
            <Progress
              value={(item.available / item.total) * 100}
              className="h-2"
            />
            <div className="grid grid-cols-2 text-xs text-muted-foreground">
              <div>
                Used: {item.used.toLocaleString()} {item.unit}
              </div>
              <div className="text-right">
                Available: {item.available.toLocaleString()} {item.unit}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
