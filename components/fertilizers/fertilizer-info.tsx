// app/fertilisers/[id]/components/fertilizer-info.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Tables } from "@/supabase/schema";

interface FertilizerInfoProps {
  fertilizer: Tables<"fertilizer_inventory">;
}

export default function FertilizerInfo({ fertilizer }: FertilizerInfoProps) {
  const fertilizerData = [
    {
      label: "Name",
      value: fertilizer.name,
    },
    {
      label: "Type",
      value: fertilizer.fertilizer_type,
    },
    {
      label: "Manufacturer",
      value: fertilizer.manufacturer || "N/A",
    },
    {
      label: "Batch Number",
      value: fertilizer.batch_number || "N/A",
    },
    {
      label: "Quantity",
      value: `${fertilizer.quantity} ${fertilizer.unit}`,
    },
    {
      label: "Purchase Date",
      value: formatDate(fertilizer.purchase_date),
    },
    {
      label: "Status",
      value:
        fertilizer.status === "in_stock"
          ? "In Stock"
          : fertilizer.status === "low_stock"
          ? "Low Stock"
          : "Out of Stock",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fertilizer Information</CardTitle>
        <CardDescription>
          Details about the fertilizer inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableBody>
            {fertilizerData.map((item) => (
              <TableRow key={item.label}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {fertilizer.purchase_proof_url && (
          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Purchase Proof</h4>
            <a
              href={fertilizer.purchase_proof_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View Document
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
