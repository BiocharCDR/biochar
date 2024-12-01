import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Tables } from "@/supabase/schema";

interface FertilizerUsageProps {
  usageRecords: Tables<"fertilizer_usage">[];
}

export default function FertilizerUsage({
  usageRecords,
}: FertilizerUsageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage History</CardTitle>
        <CardDescription>Track fertilizer application history</CardDescription>
      </CardHeader>
      <CardContent>
        {usageRecords.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Quantity Used</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.application_date)}</TableCell>
                  <TableCell>{record.quantity_used}</TableCell>
                  <TableCell>{record.purpose || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No usage records found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
