import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDate, formatTime } from "@/lib/utils";
import { Tables } from "@/supabase/schema";

interface BiocharProductionInfoProps {
  biochar: Tables<"biochar_production">;
}

export default function BiocharProductionInfo({
  biochar,
}: BiocharProductionInfoProps) {
  const productionData = [
    {
      label: "Production Date",
      value: formatDate(biochar.production_date),
    },
    {
      label: "Start Time",
      value: formatTime(biochar.start_time),
    },
    {
      label: "End Time",
      value: formatTime(biochar.end_time),
    },
    {
      label: "Biomass Weight",
      value: `${biochar.biomass_weight} kg`,
    },
    {
      label: "Biochar Weight",
      value: biochar.biochar_weight ? `${biochar.biochar_weight} kg` : "N/A",
    },
    {
      label: "Water Usage",
      value: biochar.water_usage ? `${biochar.water_usage} L` : "N/A",
    },
    {
      label: "Temperature",
      value: biochar.combustion_temperature
        ? `${biochar.combustion_temperature}°C`
        : "N/A",
    },
    {
      label: "Yield Percentage",
      value: biochar.yield_percentage ? `${biochar.yield_percentage}%` : "N/A",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Information</CardTitle>
        <CardDescription>
          Details about the biochar production process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {productionData.map((item) => (
              <TableRow key={item.label}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {biochar.production_notes && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Production Notes</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {biochar.production_notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
