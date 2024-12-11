// app/(dashboard)/biomass/[id]/components/storage-details.tsx
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BiomassProduction } from "@/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { format } from "date-fns";

interface StorageDetailsProps {
  data: BiomassProduction;
}

export function StorageDetails({ data }: StorageDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="biomass" className="space-y-4">
          <TabsList>
            <TabsTrigger value="biomass">Biomass</TabsTrigger>
            <TabsTrigger value="residue">Residue</TabsTrigger>
          </TabsList>

          <TabsContent value="biomass" className="space-y-4">
            <dl className="grid gap-4">
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Storage Location
                </dt>
                <dd className="text-sm font-semibold">
                  {data.biomass_storage_location || "Not specified"}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Storage Date
                </dt>
                <dd className="text-sm font-semibold">
                  {data.biomass_storage_date
                    ? format(new Date(data.biomass_storage_date), "PPP")
                    : "Not specified"}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Storage Conditions
                </dt>
                <dd className="text-sm font-semibold capitalize">
                  {data.biomass_storage_conditions}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Quantity
                </dt>
                <dd className="text-sm font-semibold">
                  {data.biomass_quantity?.toFixed(2) || "0"} tonnes
                </dd>
              </div>
            </dl>

            {data.biomass_storage_proof_url && (
              <div className="pt-4">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={data.biomass_storage_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Storage Proof
                  </a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="residue" className="space-y-4">
            <dl className="grid gap-4">
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Storage Location
                </dt>
                <dd className="text-sm font-semibold">
                  {data.residue_storage_location || "Not specified"}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Storage Date
                </dt>
                <dd className="text-sm font-semibold">
                  {data.residue_storage_date
                    ? format(new Date(data.residue_storage_date), "PPP")
                    : "Not specified"}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Storage Conditions
                </dt>
                <dd className="text-sm font-semibold capitalize">
                  {data.residue_storage_conditions}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-1 border-b pb-3">
                <dt className="text-sm font-medium text-muted-foreground">
                  Quantity
                </dt>
                <dd className="text-sm font-semibold">
                  {data.residue_generated?.toFixed(2) || "0"} tonnes
                </dd>
              </div>
            </dl>

            {data.residue_storage_proof_url && (
              <div className="pt-4">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={data.residue_storage_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Storage Proof
                  </a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
