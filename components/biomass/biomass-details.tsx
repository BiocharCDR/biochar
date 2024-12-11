// app/(dashboard)/biomass/[id]/components/biomass-details.tsx
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiomassProductionWithParcelName } from "./types";
import { BiomassProduction } from "@/types";

interface BiomassDetailsProps {
  data: BiomassProductionWithParcelName;
}

export function BiomassDetails({ data }: BiomassDetailsProps) {
  const details = [
    {
      label: "Parcel Name",
      value: data.land_parcels?.parcel_name,
    },
    {
      label: "Total Area",
      value: `${data.land_parcels?.total_area || 0} ha`,
    },
    {
      label: "Cultivable Area",
      value: `${data.land_parcels?.cultivable_area || 0} ha`,
    },
    {
      label: "Crop Type",
      value: data.crop_type,
    },
    {
      label: "Harvest Date",
      value: format(new Date(data.harvest_date), "PPP"),
    },
    {
      label: "Moisture Content",
      value: data.moisture_content
        ? `${data.moisture_content}%`
        : "Not specified",
    },
    {
      label: "Quality Grade",
      value: data.quality_grade || "Not graded",
    },
    {
      label: "Status",
      value: data.status || "Not specified",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          {details.map((detail, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-1 border-b pb-3 last:border-0 last:pb-0"
            >
              <dt className="text-sm font-medium text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="text-sm font-semibold">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
