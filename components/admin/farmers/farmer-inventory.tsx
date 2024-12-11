/* eslint-disable */
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
  Package,
  Sprout,
  CircleDollarSign,
  Calendar,
  Leaf,
  BarChart2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface FarmerInventoryProps {
  farmerId: string;
}

export function FarmerInventory({ farmerId }: FarmerInventoryProps) {
  const [inventoryData, setInventoryData] = useState<any>({
    fertilizers: [],
    usage: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchInventoryData() {
      // Fetch fertilizer inventory
      const { data: fertilizers } = await supabase
        .from("fertilizer_inventory")
        .select(
          `
          *,
          usage:fertilizer_usage(
            id,
            quantity_used,
            application_date,
            parcel:parcel_id(
              parcel_name
            )
          )
        `
        )
        .eq("farmer_id", farmerId)
        .order("purchase_date", { ascending: false });

      setInventoryData({
        fertilizers: fertilizers || [],
        usage: fertilizers?.flatMap((f) => f.usage || []) || [],
      });
      setIsLoading(false);
    }

    fetchInventoryData();
  }, [farmerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        Loading...
      </div>
    );
  }

  const totalFertilizers = inventoryData.fertilizers.reduce(
    (sum: number, item: any) => sum + (item.quantity || 0),
    0
  );

  const totalUsed = inventoryData.usage.reduce(
    (sum: number, item: any) => sum + (item.quantity_used || 0),
    0
  );

  const unusedQuantity = totalFertilizers - totalUsed;

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFertilizers} kg</div>
            <p className="text-xs text-muted-foreground">
              Total fertilizers purchased
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fertilizer Used
            </CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsed} kg</div>
            <p className="text-xs text-muted-foreground">
              Total fertilizers applied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unusedQuantity} kg</div>
            <p className="text-xs text-muted-foreground">Available inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFertilizers
                ? ((totalUsed / totalFertilizers) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Fertilizer utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Fertilizer Inventory</TabsTrigger>
          <TabsTrigger value="usage">Usage History</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Fertilizer Inventory</CardTitle>
              <CardDescription>
                Track fertilizer purchases and stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.fertilizers.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.fertilizer_type || "N/A"}</TableCell>
                      <TableCell>{item.manufacturer || "N/A"}</TableCell>
                      <TableCell>
                        {format(new Date(item.purchase_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "available"
                              ? "default"
                              : item.status === "low"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {item.status || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.purchase_proof_url ? (
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={item.purchase_proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">No docs</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Fertilizer Usage History</CardTitle>
              <CardDescription>
                Track fertilizer applications across parcels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Parcel</TableHead>
                    <TableHead>Fertilizer</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.usage.map((usage: any) => (
                    <TableRow key={usage.id}>
                      <TableCell className="font-medium">
                        {format(
                          new Date(usage.application_date),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell>
                        {usage.parcel?.parcel_name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {inventoryData.fertilizers.find(
                          (f: any) => f.id === usage.inventory_id
                        )?.name || "N/A"}
                      </TableCell>
                      <TableCell>{usage.quantity_used} kg</TableCell>
                      <TableCell>{usage.purpose || "N/A"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {usage.notes || "No notes"}
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
