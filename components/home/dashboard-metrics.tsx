"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, MapPin, Scale, Database } from "lucide-react";

interface DashboardMetricsProps {
  metrics: any;
}

export default function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const cards = [
    {
      title: "Total Production",
      value: metrics?.total_biochar_produced || "0",
      unit: "kg",
      icon: Factory,
      description: "Total biochar produced",
    },
    {
      title: "Active Parcels",
      value: metrics?.active_parcels || "0",
      unit: "parcels",
      icon: MapPin,
      description: "Land parcels in use",
    },
    {
      title: "Average Yield",
      value: metrics?.average_yield_percentage || "0",
      unit: "%",
      icon: Scale,
      description: "Production efficiency",
    },
    {
      title: "Storage Used",
      value: metrics?.storage_used || "0",
      unit: "%",
      icon: Database,
      description: "Storage capacity utilized",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {card.unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
