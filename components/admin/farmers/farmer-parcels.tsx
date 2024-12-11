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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, MapPin, MoreHorizontal, Leaf, Box } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface FarmerParcelsProps {
  farmerId: string;
}

export function FarmerParcels({ farmerId }: FarmerParcelsProps) {
  const [parcels, setParcels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchParcels() {
      const { data } = await supabase
        .from("land_parcels")
        .select(
          `
          *,
          biomass_production (
            id,
            crop_type,
            crop_yield
          ),
          biochar_application (
            id,
            application_date,
            quantity_used
          )
        `
        )
        .eq("farmer_id", farmerId)
        .order("created_at", { ascending: false });

      setParcels(data || []);
      setIsLoading(false);
    }

    fetchParcels();
  }, [farmerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {/* Parcels Overview Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Parcels
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {parcels.length}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Registered land parcels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Area
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {parcels.reduce(
                (sum, parcel) => sum + (parcel.total_area || 0),
                0
              )}{" "}
              ha
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Combined land area
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Cultivable Area
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {parcels.reduce(
                (sum, parcel) => sum + (parcel.cultivable_area || 0),
                0
              )}{" "}
              ha
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Total cultivable land
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Storage Area
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {parcels.reduce(
                (sum, parcel) => sum + (parcel.available_storage_area || 0),
                0
              )}{" "}
              m²
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Available storage space
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parcels Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Land Parcels</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage and view registered land parcels
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    Parcel Name
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Total Area
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Cultivable Area
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Avg. Yield
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Verification
                  </TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcels.map((parcel) => (
                  <TableRow key={parcel.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground hidden sm:block" />
                        <span className="whitespace-nowrap">
                          {parcel.parcel_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {parcel.total_area || 0} ha
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {parcel.cultivable_area || 0} ha
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {parcel.avg_crop_yield || 0} t/ha
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          parcel.status === "active" ? "default" : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {parcel.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          parcel.verification_status === "verified"
                            ? "default"
                            : parcel.verification_status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                        className="whitespace-nowrap"
                      >
                        {parcel.verification_status || "unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/parcels/${parcel.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/parcels/${parcel.id}/biomass`)
                            }
                          >
                            <Leaf className="mr-2 h-4 w-4" />
                            Biomass Records
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/admin/parcels/${parcel.id}/applications`
                              )
                            }
                          >
                            <Box className="mr-2 h-4 w-4" />
                            Biochar Applications
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
