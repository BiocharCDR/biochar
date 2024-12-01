// app/(dashboard)/biomass/[id]/components/storage-details.tsx
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BiomassProduction } from "@/types";

interface StorageDetailsProps {
  data: BiomassProduction;
}

export function StorageDetails({ data }: StorageDetailsProps) {
  const details = [
    {
      label: "Residue Generated",
      value: `${data.residue_generated?.toFixed(2) || "0"} tonnes`,
    },
    {
      label: "Storage Location",
      value: data.residue_storage_location || "Not specified",
    },
    {
      label: "Storage Conditions",
      value: data.storage_conditions
        ? data.storage_conditions.charAt(0).toUpperCase() +
          data.storage_conditions.slice(1)
        : "Not specified",
    },
    {
      label: "Notes",
      value: data.notes || "No notes provided",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Storage Proof Document */}
        {data.storage_proof_url && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Storage Proof
            </h4>
            <Button variant="outline" size="sm" asChild>
              <a
                href={data.storage_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Document
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
