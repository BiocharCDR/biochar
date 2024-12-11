// app/home/dashboard-metrics.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/supabase/schema";
import {
  Leaf,
  Factory,
  Scale,
  PackageOpen,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardMetricsProps {
  metrics: Tables<"production_metrics"> | null;
}

export default function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const cards = [
    {
      title: "Biomass Production",
      mainValue: metrics?.total_biomass_produced || 0,
      mainUnit: "kg",
      icon: Leaf,
      subValues: [
        {
          label: "Used",
          value: metrics?.biomass_used || 0,
          unit: "kg",
        },
        {
          label: "Available",
          value: metrics?.biomass_remaining || 0,
          unit: "kg",
        },
      ],
    },
    {
      title: "Biochar Production",
      mainValue: metrics?.total_biochar_produced || 0,
      mainUnit: "kg",
      icon: Factory,
      subValues: [
        {
          label: "Used",
          value: metrics?.biochar_used || 0,
          unit: "kg",
        },
        {
          label: "In Storage",
          value: metrics?.biochar_remaining || 0,
          unit: "kg",
        },
      ],
    },
    {
      title: "Conversion Rate",
      mainValue: metrics?.average_yield_percentage || 0,
      mainUnit: "%",
      icon: Scale,
      target: 30, // Example target
      showWarning: (metrics?.average_yield_percentage || 0) < 25,
      warningMessage: "Below target conversion rate",
    },
    {
      title: "Storage Capacity",
      mainValue: metrics?.total_storage_used || 0,
      mainUnit: "%",
      icon: PackageOpen,
      target: 80, // Warning threshold
      showWarning: (metrics?.total_storage_used || 0) > 80,
      warningMessage: "Storage nearly full",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <card.icon className="h-5 w-5 text-muted-foreground" />
              {card.showWarning && (
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{card.warningMessage}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold">
                {card.mainValue.toLocaleString("en-US", {
                  maximumFractionDigits: 1,
                })}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {card.mainUnit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
            </div>

            {card.subValues && (
              <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t">
                {card.subValues.map((sub) => (
                  <div key={sub.label}>
                    <p className="text-sm font-medium">
                      {sub.value.toLocaleString("en-US", {
                        maximumFractionDigits: 1,
                      })}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        {sub.unit}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{sub.label}</p>
                  </div>
                ))}
              </div>
            )}

            {card.target && (
              <div className="mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Target: {card.target}
                    {card.mainUnit}
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        card.showWarning ? "bg-yellow-500" : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min(
                          (card.mainValue / card.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
