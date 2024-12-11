import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

// types.ts
export interface BiocharProduction {
  id: string | null;
  batch_number: string | null;
  biochar_weight: number | null;
  biomass_weight: number | null;
  combustion_temperature: number | null;
  end_time: string | null;
  production_date: string | null;
  start_time: string | null;
  yield_percentage: number | null;
}

export interface BiomassUsageRecord {
  id: string | null;
  biomass_id: string | null;
  quantity_used: number | null;
  usage_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  biochar_production: BiocharProduction | null;
}

// biomass-usage.tsx

interface BiomassUsageProps {
  data: BiomassUsageRecord[];
}

export function BiomassUsage({ data }: BiomassUsageProps) {
  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No usage records found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((usage) => (
            <div
              key={usage.id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  Batch: {usage?.biochar_production?.batch_number}
                </p>
                <p className="text-sm text-muted-foreground">
                  Used on {format(new Date(usage?.usage_date!), "PPP")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Production time: {usage?.biochar_production?.start_time} -{" "}
                  {usage?.biochar_production?.end_time}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-medium">{usage.quantity_used}kg used</p>
                <p className="text-sm text-muted-foreground">
                  {usage?.biochar_production?.yield_percentage!.toFixed(1)}%
                  yield
                </p>
                <p className="text-sm text-muted-foreground">
                  Temperature:{" "}
                  {usage?.biochar_production?.combustion_temperature}
                  °C
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
