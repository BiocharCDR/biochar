import { Card, CardContent } from "@/components/ui/card";
import { BiocharProduction } from "@/types";
import { BadgePercent, Scale, ThermometerSun, Droplets } from "lucide-react";

interface StatsCardsProps {
  data: BiocharProduction[];
}

export function StatsCards({ data }: StatsCardsProps) {
  // Calculate statistics
  const totalBiochar = data.reduce((sum, record) => {
    return sum + (record.biochar_weight || 0);
  }, 0);

  const averageYield =
    data.reduce((sum, record) => {
      return sum + (record.yield_percentage || 0);
    }, 0) /
    (data.filter((record) => record.yield_percentage !== null).length || 1);

  const averageTemp =
    data.reduce((sum, record) => {
      return sum + (record.combustion_temperature || 0);
    }, 0) /
    (data.filter((record) => record.combustion_temperature !== null).length ||
      1);

  const totalWaterUsage = data.reduce((sum, record) => {
    return sum + (record.water_usage || 0);
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                Total Production
              </p>
              <p className="text-2xl font-bold mt-2">
                {totalBiochar.toFixed(2)} kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <BadgePercent className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">Average Yield</p>
              <p className="text-2xl font-bold mt-2">
                {averageYield.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <ThermometerSun className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                Average Temperature
              </p>
              <p className="text-2xl font-bold mt-2">
                {averageTemp.toFixed(1)}°C
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Droplets className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                Total Water Usage
              </p>
              <p className="text-2xl font-bold mt-2">
                {totalWaterUsage.toFixed(2)} L
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
