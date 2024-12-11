// components/biochar/biochar-quality-info.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tables } from "@/supabase/schema";

interface BiocharQualityInfoProps {
  biochar: Tables<"biochar_production">;
}

export default function BiocharQualityInfo({
  biochar,
}: BiocharQualityInfoProps) {
  const qualityParams =
    (biochar.quality_parameters as Record<string, number>) || {};

  const qualityData = [
    {
      label: "pH Level",
      value: qualityParams.ph_level
        ? `${qualityParams.ph_level.toFixed(1)}`
        : "N/A",
    },
    {
      label: "Moisture Content",
      value: qualityParams.moisture_content
        ? `${qualityParams.moisture_content.toFixed(1)}%`
        : "N/A",
    },
    {
      label: "Carbon Content",
      value: qualityParams.carbon_content
        ? `${qualityParams.carbon_content.toFixed(1)}%`
        : "N/A",
    },
    {
      label: "Ash Content",
      value: qualityParams.ash_content
        ? `${qualityParams.ash_content.toFixed(1)}%`
        : "N/A",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Parameters</CardTitle>
        <CardDescription>
          Quality analysis results of the produced biochar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {qualityData.map((item) => (
              <TableRow key={item.label}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
