// components/biochar/biochar-storage-info.tsx
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface BiocharStorageInfoProps {
  storage: Tables<"biochar_storage"> | null;
}

export default function BiocharStorageInfo({
  storage,
}: BiocharStorageInfoProps) {
  if (!storage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storage Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No Storage Information</AlertTitle>
            <AlertDescription>
              Storage details haven't been recorded for this production batch
              yet.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const storageData = [
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
      label: "Storage Conditions",
      value: storage.storage_conditions || "Not specified",
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
      </CardContent>
    </Card>
  );
}
