"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { format } from "date-fns";
import {
  Factory,
  TreeDeciduous,
  Droplets,
  Thermometer,
  Timer,
  Scale,
  BarChart2,
  Warehouse,
} from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface FarmerProductionProps {
  farmerId: string;
}

export function FarmerProduction({ farmerId }: FarmerProductionProps) {
  const [productionData, setProductionData] = useState<any>({
    biochar: [],
    biomass: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchProductionData() {
      // Fetch biochar production data
      const { data: biocharData } = await supabase
        .from("biochar_production")
        .select(
          `
          *,
          biomass:biomass_id(
            crop_type,
            moisture_content
          ),
          storage:biochar_storage(*)
        `
        )
        .eq("farmer_id", farmerId)
        .order("production_date", { ascending: false });

      // Fetch biomass production data
      const { data: biomassData } = await supabase
        .from("biomass_production")
        .select(
          `
          *,
          parcel:parcel_id(
            parcel_name
          )
        `
        )
        .order("harvest_date", { ascending: false });

      setProductionData({
        biochar: biocharData || [],
        biomass: biomassData || [],
      });
      setIsLoading(false);
    }

    fetchProductionData();
  }, [farmerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Production Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Productions
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionData.biochar.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Biochar batches produced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                productionData.biochar.reduce(
                  (sum: number, item: any) =>
                    sum + (item.yield_percentage || 0),
                  0
                ) / (productionData.biochar.length || 1)
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Average conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Biomass Used
            </CardTitle>
            <TreeDeciduous className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionData.biochar.reduce(
                (sum: number, item: any) => sum + (item.biomass_weight || 0),
                0
              )}{" "}
              kg
            </div>
            <p className="text-xs text-muted-foreground">
              Total biomass processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productionData.biochar.reduce(
                (sum: number, item: any) => sum + (item.water_usage || 0),
                0
              )}{" "}
              L
            </div>
            <p className="text-xs text-muted-foreground">
              Total water consumed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Production Tabs */}
      <Tabs defaultValue="biochar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="biochar">Biochar Production</TabsTrigger>
          <TabsTrigger value="biomass">Biomass Records</TabsTrigger>
        </TabsList>

        <TabsContent value="biochar">
          <Card>
            <CardHeader>
              <CardTitle>Biochar Production History</CardTitle>
              <CardDescription>All biochar production batches</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Production Date</TableHead>
                    <TableHead>Biomass Used</TableHead>
                    <TableHead>Biochar Produced</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Water Used</TableHead>
                    <TableHead>Yield</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionData.biochar.map((batch: any) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">
                        {batch.batch_number}
                      </TableCell>
                      <TableCell>
                        {format(new Date(batch.production_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{batch.biomass_weight} kg</TableCell>
                      <TableCell>{batch.biochar_weight} kg</TableCell>
                      <TableCell>{batch.combustion_temperature}°C</TableCell>
                      <TableCell>{batch.water_usage} L</TableCell>
                      <TableCell>{batch.yield_percentage}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            batch.status === "completed"
                              ? "default"
                              : batch.status === "in_progress"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {batch.status || "N/A"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biomass">
          <Card>
            <CardHeader>
              <CardTitle>Biomass Production Records</CardTitle>
              <CardDescription>
                Harvested biomass and storage details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Harvest Date</TableHead>
                    <TableHead>Parcel</TableHead>
                    <TableHead>Crop Type</TableHead>
                    <TableHead>Crop Yield</TableHead>
                    <TableHead>Residue Generated</TableHead>
                    <TableHead>Storage Location</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionData.biomass.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.harvest_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {record.parcel?.parcel_name || "N/A"}
                      </TableCell>
                      <TableCell>{record.crop_type}</TableCell>
                      <TableCell>{record.crop_yield} t/ha</TableCell>
                      <TableCell>{record.residue_generated} kg</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4 text-muted-foreground" />
                          {record.residue_storage_location || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.quality_grade === "high"
                              ? "default"
                              : record.quality_grade === "medium"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {record.quality_grade || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "stored"
                              ? "default"
                              : record.status === "processing"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {record.status || "N/A"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
