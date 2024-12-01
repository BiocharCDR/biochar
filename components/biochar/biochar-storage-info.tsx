// app/biochar/[id]/components/biochar-storage-info.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Tables } from "@/supabase/schema";

interface BiocharStorageInfoProps {
  storage: Tables<"biochar_storage">;
}

export default function BiocharStorageInfo({
  storage,
}: BiocharStorageInfoProps) {
  const storageData = [
    {
      label: "Storage Date",
      value: formatDate(storage.storage_date),
    },
    {
      label: "Storage Location",
      value: storage.storage_location,
    },
    {
      label: "Quantity Stored",
      value: `${storage.quantity_stored} kg`,
    },
    {
      label: "Mixed with Fertilizer",
      value: storage.mixed_with_fertilizer ? "Yes" : "No",
    },
    {
      label: "Organic Fertilizer Used",
      value: storage.organic_fertilizer_used || "N/A",
    },
    {
      label: "Storage Conditions",
      value: storage.storage_conditions || "N/A",
    },
    {
      label: "Quality Check Date",
      value: storage.quality_check_date
        ? formatDate(storage.quality_check_date)
        : "N/A",
    },
    {
      label: "Status",
      value: storage.status || "N/A",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Information</CardTitle>
        <CardDescription>
          Details about biochar storage and handling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {storageData.map((item) => (
              <TableRow key={item.label}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {storage.quality_parameters && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Quality Parameters</h4>
            <pre className="mt-1 rounded-md bg-secondary p-4 text-sm">
              {JSON.stringify(storage.quality_parameters, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
