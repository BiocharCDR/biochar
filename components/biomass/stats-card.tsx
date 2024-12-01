import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiomassProduction } from "@/types";
import { Sprout, Scale, BarChart3, TreesIcon } from "lucide-react";
import { StatCard } from "./types";

interface StatsCardsProps {
  data: BiomassProduction[];
}

export function StatsCards({ data }: StatsCardsProps) {
  // Calculate statistics
  const totalBiomass = data.reduce((sum, record) => {
    return sum + (record.crop_yield || 0);
  }, 0);

  const totalResidue = data.reduce((sum, record) => {
    return sum + (record.residue_generated || 0);
  }, 0);

  const averageYield =
    data.length > 0
      ? data.reduce((sum, record) => sum + (record.crop_yield || 0), 0) /
        data.length
      : 0;

  const stats: StatCard[] = [
    {
      title: "Total Biomass",
      value: `${totalBiomass.toFixed(2)} tonnes`,
      description: "Total crop yield produced",
      icon: TreesIcon,
    },
    {
      title: "Total Residue",
      value: `${totalResidue.toFixed(2)} tonnes`,
      description: "Total residue generated",
      icon: Sprout,
    },
    {
      title: "Average Yield",
      value: `${averageYield.toFixed(2)} t/ha`,
      description: "Average yield per harvest",
      icon: Scale,
    },
    {
      title: "Active Records",
      value: data.filter((record) => record.status === "active").length,
      description: "Currently active biomass records",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
