"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const DOCUMENT_TYPES = {
  OWNERSHIP_PROOF: "ownership_proof",
  MAP: "map",
  SOIL_TEST: "soil_test",
  OTHER: "other",
} as const;

const VERIFICATION_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];
type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

const parcelFormSchema = z.object({
  parcel_name: z
    .string()
    .min(2, "Parcel name must be at least 2 characters")
    .max(50, "Parcel name must not exceed 50 characters"),
  total_area: z
    .string()
    .min(1, "Total area is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "Must be a positive number"),
  cultivable_area: z
    .string()
    .min(1, "Cultivable area is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "Must be a positive number"),
  gps_coordinates: z
    .string()
    .min(1, "GPS coordinates are required")
    .regex(
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
      "Invalid GPS coordinates format"
    ),
  avg_crop_yield: z
    .string()
    .min(1, "Average crop yield is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, "Must be a non-negative number"),
  avg_residue_yield: z
    .string()
    .min(1, "Average residue yield is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, "Must be a non-negative number"),
  avg_residue_consumption: z
    .string()
    .min(1, "Average residue consumption is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, "Must be a non-negative number"),
  biochar_facility_distance: z
    .string()
    .min(1, "Biochar facility distance is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, "Must be a non-negative number"),
  storage_facility_distance: z
    .string()
    .min(1, "Storage facility distance is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, "Must be a non-negative number"),
  available_storage_area: z
    .string()
    .min(1, "Available storage area is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= 0, "Must be a non-negative number"),
  shape_file_url: z
    .instanceof(File, { message: "Shape file is required" })
    .optional(),

  status: z.enum(["active", "inactive"]),
  verification_status: z
    .enum(["pending", "verified", "rejected"])
    .default("pending"),

  // document files
  ownership_proof: z.instanceof(File, {
    message: "Ownership proof is required",
  }),
  land_survey_document: z.instanceof(File, {
    message: "Land survey document is required",
  }),
});

type ParcelFormValues = z.infer<typeof parcelFormSchema>;

const defaultValues: Partial<ParcelFormValues> = {
  parcel_name: "",
  total_area: 0,
  cultivable_area: 0,
  gps_coordinates: "",
  avg_crop_yield: 0,
  avg_residue_yield: 0,
  avg_residue_consumption: 0,
  biochar_facility_distance: 0,
  storage_facility_distance: 0,
  available_storage_area: 0,
  status: "active",
  verification_status: "pending",
};

const NewParcelPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const form = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelFormSchema),
    defaultValues,
  });

  async function uploadFile(file: File, parcelId: string, fileType: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${parcelId}/${fileType}.${fileExt}`;
    let bucket = "parcel-documents";

    // Use shape-files bucket for shape files

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return publicUrl;
  }

  async function uploadDocument(
    file: File,
    parcelId: string,
    documentType: DocumentType
  ) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${parcelId}/${documentType}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("parcel-documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("parcel-documents").getPublicUrl(fileName);

    return {
      url: publicUrl,
      fileName,
      fileType: file.type,
      fileSize: file.size,
      originalName: file.name,
    };
  }

  async function onSubmit(data: ParcelFormValues) {
    setIsUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to add a parcel");
        return;
      }

      //   // Upload shape file first if provided
      let shapeFileUrl = "";
      if (data.shape_file_url) {
        shapeFileUrl = await uploadFile(
          data.shape_file_url,
          user.id,
          "shape_file"
        );
      }

      // Create parcel with all fields
      const { data: parcel, error: parcelError } = await supabase
        .from("land_parcels")
        .insert({
          farmer_id: user.id,
          parcel_name: data.parcel_name,
          total_area: data.total_area,
          cultivable_area: data.cultivable_area,
          gps_coordinates: data.gps_coordinates,
          shape_file_url: shapeFileUrl,
          avg_crop_yield: data.avg_crop_yield,
          avg_residue_yield: data.avg_residue_yield,
          avg_residue_consumption: data.avg_residue_consumption,
          biochar_facility_distance: data.biochar_facility_distance,
          storage_facility_distance: data.storage_facility_distance,
          available_storage_area: data.available_storage_area,
          status: data.status,
          verification_status: VERIFICATION_STATUS.PENDING,
        })
        .select()
        .single();

      if (parcelError) throw parcelError;

      // Upload and create records for required documents
      const documents = [
        {
          file: data.ownership_proof,
          type: DOCUMENT_TYPES.OWNERSHIP_PROOF,
        },
        {
          file: data.land_survey_document,
          type: DOCUMENT_TYPES.MAP,
        },
      ];

      for (const doc of documents) {
        const fileData = await uploadDocument(doc.file, parcel.id, doc.type);

        const { error: docError } = await supabase
          .from("parcel_documents")
          .insert({
            parcel_id: parcel.id,
            document_type: doc.type,
            document_url: fileData.url,
            status: VERIFICATION_STATUS.PENDING,
            verification_status: VERIFICATION_STATUS.PENDING,
            document_name: fileData.fileName,
          });

        if (docError) {
          console.error("Document insertion error:", docError);
          throw new Error(`Failed to save document information: ${doc.type}`);
        }
      }

      toast.success("Parcel added successfully and pending verification");
      router.push("/parcels");
    } catch (error) {
      console.error("Error adding parcel:", error);
      toast.error("Failed to add parcel");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Add New Land Parcel
        </h1>
        <p className="text-muted-foreground">
          Register a new land parcel with complete details and required
          documentation.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of your land parcel
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic fields go here - I'll continue in the next part */}
              <FormField
                control={form.control}
                name="parcel_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="North Field" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gps_coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Coordinates</FormLabel>
                    <FormControl>
                      <Input placeholder="12.9716, 77.5946" {...field} />
                    </FormControl>
                    <FormDescription>
                      Format: latitude, longitude
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shape_file_url"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Shape File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpeg,.jpg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload shape file (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Area Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Area Information</CardTitle>
              <CardDescription>
                Provide details about the land area and yields
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Area (ha)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Total area in hectares</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cultivable_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultivable Area (ha)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="85.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cultivable area in hectares
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available_storage_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Storage Area (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="500.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Available storage area in square meters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Yield Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Yield Information</CardTitle>
              <CardDescription>
                Enter details about crop and residue yields
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="avg_crop_yield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Crop Yield (t/ha)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="4.5"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Average crop yield in tonnes per hectare
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avg_residue_yield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Residue Yield (t/ha)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="2.0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Average residue yield in tonnes per hectare
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avg_residue_consumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Residue Consumption (t/year)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="1.5"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Average residue consumption in tonnes per year
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Facility Distances Card */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Distances</CardTitle>
              <CardDescription>
                Specify distances to various facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="biochar_facility_distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biochar Facility Distance (km)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="5.0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Distance to nearest biochar facility in kilometers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storage_facility_distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Facility Distance (km)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="3.0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Distance to storage facility in kilometers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Please upload the following documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="ownership_proof"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Ownership Proof</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload ownership proof document (PDF, JPG, PNG)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="land_survey_document"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Land Survey Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload land survey document (PDF, JPG, PNG)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/parcels")}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Adding Parcel..." : "Add Parcel"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewParcelPage;
