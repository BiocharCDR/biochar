// app/storage/[id]/components/application-history.tsx
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
import { ApplicationHistoryProps } from "./types";

export default function ApplicationHistory({
  applications,
}: ApplicationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application History</CardTitle>
        <CardDescription>Record of biochar applications</CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Parcel</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    {formatDate(application.application_date)}
                  </TableCell>
                  <TableCell>{application.parcel.parcel_name}</TableCell>
                  <TableCell>{application.quantity_used} kg</TableCell>
                  <TableCell>
                    {application.application_method || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No applications recorded yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
