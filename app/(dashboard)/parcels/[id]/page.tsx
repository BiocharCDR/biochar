import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Edit,
  MapPin,
  FileText,
  Crop,
  Building2,
  Container,
  Warehouse,
} from "lucide-react";

import { createSupabaseServer } from "@/lib/supabase/server";
import { ParcelStatusBadge } from "@/components/parcels/parcel-status-badge";
import { VerificationStatus } from "@/components/parcels/verification-status";
import { DocumentList } from "@/components/parcels/document-list";
import { LandParcel, ParcelDocument, Profile } from "@/types";

interface ParcelDetailsProps {
  params: {
    id: string;
  };
}

type ParcelWithFarmer = Pick<
  LandParcel,
  | "id"
  | "available_storage_area"
  | "avg_crop_yield"
  | "avg_residue_consumption"
  | "avg_residue_yield"
  | "biochar_facility_distance"
  | "created_at"
  | "cultivable_area"
  | "farmer_id"
  | "gps_coordinates"
  | "parcel_name"
  | "shape_file_url"
  | "status"
  | "storage_facility_distance"
  | "total_area"
  | "updated_at"
  | "verification_status"
> & {
  profiles: Pick<Profile, "full_name" | "email">;
};

export default async function ParcelDetailsPage({
  params,
}: ParcelDetailsProps) {
  const supabase = createSupabaseServer();

  // Fetch parcel details with farmer information
  const { data: parcel, error } = await supabase
    .from("land_parcels")
    .select(
      `
      *,
      profiles:farmer_id (
        full_name,
        email
      )
    `
    )
    .eq("id", params.id)
    .single<ParcelWithFarmer>();

  if (error || !parcel) {
    return notFound();
  }

  // Fetch parcel documents
  const { data: documents } = await supabase
    .from("parcel_documents")
    .select("*")
    .eq("parcel_id", params.id);

  console.log(documents);

  if (error || !parcel) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {parcel.parcel_name}
          </h1>
          <p className="text-muted-foreground">
            Owned by {parcel.profiles?.full_name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ParcelStatusBadge status={parcel.status!} />
          <Link href={`/parcels/edit/${params.id}`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Parcel
            </Button>
          </Link>
        </div>
      </div>

      {/* Verification Status */}
      <div className="mb-6">
        <VerificationStatus
          status={
            parcel.verification_status as "pending" | "verified" | "rejected"
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General details about the parcel</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">GPS Coordinates</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.gps_coordinates}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Crop className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Area</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.total_area} hectares
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Cultivable Area</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.cultivable_area} hectares
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yield Information */}
        <Card>
          <CardHeader>
            <CardTitle>Yield Information</CardTitle>
            <CardDescription>Crop and residue yield details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <Crop className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Average Crop Yield</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.avg_crop_yield} tonnes/hectare
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Container className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Average Residue Yield</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.avg_residue_yield} tonnes/hectare
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Container className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Residue Consumption</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.avg_residue_consumption} tonnes/year
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facility Information */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Information</CardTitle>
            <CardDescription>Distance to various facilities</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Biochar Facility Distance</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.biochar_facility_distance} km
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Storage Facility Distance</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.storage_facility_distance} km
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Available Storage Area</p>
                <p className="text-sm text-muted-foreground">
                  {parcel.available_storage_area} m²
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Uploaded parcel documents and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentList documents={documents || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
