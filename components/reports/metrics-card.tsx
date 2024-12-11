"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon, Factory, Scale, Database } from "lucide-react";

interface MetricsCardsProps {
  metrics: {
    biomass: {
      total: number;
      used: number;
      remaining: number;
    };
    biochar: {
      produced: number;
      stored: number;
    };
    fertilizer: {
      total: number;
      used: number;
    };
  };
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Biomass Status",
      icon: ActivityIcon,
      metrics: [
        { label: "Total Produced", value: metrics.biomass.total, unit: "kg" },
        { label: "Used", value: metrics.biomass.used, unit: "kg" },
        { label: "Remaining", value: metrics.biomass.remaining, unit: "kg" },
      ],
    },
    {
      title: "Biochar Production",
      icon: Factory,
      metrics: [
        {
          label: "Total Produced",
          value: metrics.biochar.produced,
          unit: "kg",
        },
        { label: "In Storage", value: metrics.biochar.stored, unit: "kg" },
      ],
    },
    {
      title: "Fertilizer Inventory",
      icon: Database,
      metrics: [
        {
          label: "Total Purchased",
          value: metrics.fertilizer.total,
          unit: "kg",
        },
        { label: "Used", value: metrics.fertilizer.used, unit: "kg" },
        {
          label: "Available",
          value: metrics.fertilizer.total - metrics.fertilizer.used,
          unit: "kg",
        },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {card.metrics.map((metric, index) => (
              <div key={metric.label} className={index !== 0 ? "mt-2" : ""}>
                <div className="text-xs text-muted-foreground">
                  {metric.label}
                </div>
                <div className="text-xl font-bold">
                  {metric.value.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
