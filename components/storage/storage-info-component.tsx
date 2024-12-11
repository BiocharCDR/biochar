// app/storage/[id]/components/storage-info.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { StorageInfoProps } from "./types";

export default function StorageInfo({ storage }: StorageInfoProps) {
  const storageData = [
    {
      label: "Batch Number",
      value: storage.biochar.batch_number,
    },
    {
      label: "Storage Location",
      value: storage.storage_location,
    },
    {
      label: "Storage Date",
      value: formatDate(storage.storage_date),
    },
    {
      label: "Quantity Stored",
      value: `${storage.quantity_stored} kg`,
    },
    {
      label: "Quanity Remaining",
      value: storage.quantity_remaining
        ? `${storage.quantity_remaining} kg`
        : "0 kg",
    },
    {
      label: "Status",
      value: storage.status || "None",
    },
    {
      label: "Storage Conditions",
      value: storage.storage_conditions || "N/A",
    },
    {
      label: "Quality Check Date",
      value: storage.quality_check_date
        ? formatDate(storage.quality_check_date)
        : "Not checked",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Information</CardTitle>
        <CardDescription>Details about the stored biochar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <div>
            <h4 className="text-sm font-medium mb-2">Quality Parameters</h4>
            <pre className="rounded-lg bg-muted p-4 text-sm">
              {JSON.stringify(storage.quality_parameters, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
