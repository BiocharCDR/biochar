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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Database } from "@/supabase/schema";

type ParcelDocument = {
  id: string;
  document_url: string;
  document_name: string | null;
  document_type: string | null;
  verification_status: string | null;
};

type Parcel = {
  id: string;
  farmer_id: string;
  parcel_name: string;
  gps_coordinates: string | null;
  shape_file_url: string | null;
  total_area: number | null;
  cultivable_area: number | null;
  avg_crop_yield: number | null;
  avg_residue_yield: number | null;
  avg_residue_consumption: number | null;
  biochar_facility_distance: number | null;
  storage_facility_distance: number | null;
  available_storage_area: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  verification_status: string | null;
  parcel_documents: ParcelDocument[];
};

interface EditParcelFormProps {
  parcel: Parcel;
}

const editParcelSchema = z.object({
  parcel_name: z
    .string()
    .min(2, "Parcel name must be at least 2 characters")
    .max(50, "Parcel name must not exceed 50 characters"),
  total_area: z
    .number()
    .nullable()
    .refine((val) => val === null || val > 0, "Must be a positive number"),
  cultivable_area: z
    .number()
    .nullable()
    .refine((val) => val === null || val > 0, "Must be a positive number"),
  gps_coordinates: z
    .string()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(
        val
      );
    }, "Invalid GPS coordinates format"),
  avg_crop_yield: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 0, "Must be a non-negative number"),
  avg_residue_yield: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 0, "Must be a non-negative number"),
  avg_residue_consumption: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 0, "Must be a non-negative number"),
  biochar_facility_distance: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 0, "Must be a non-negative number"),
  storage_facility_distance: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 0, "Must be a non-negative number"),
  available_storage_area: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 0, "Must be a non-negative number"),
  status: z.string().nullable(),
  new_ownership_proof: z.instanceof(File).optional(),
  new_land_survey: z.instanceof(File).optional(),
});

type EditParcelFormValues = z.infer<typeof editParcelSchema>;

interface EditParcelFormProps {
  parcel: Parcel;
}

export function EditParcelForm({ parcel }: EditParcelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const form = useForm<EditParcelFormValues>({
    resolver: zodResolver(editParcelSchema),
    defaultValues: {
      parcel_name: parcel.parcel_name,
      total_area: parcel.total_area,
      cultivable_area: parcel.cultivable_area,
      gps_coordinates: parcel.gps_coordinates,
      avg_crop_yield: parcel.avg_crop_yield,
      avg_residue_yield: parcel.avg_residue_yield,
      avg_residue_consumption: parcel.avg_residue_consumption,
      biochar_facility_distance: parcel.biochar_facility_distance,
      storage_facility_distance: parcel.storage_facility_distance,
      available_storage_area: parcel.available_storage_area,
      status: parcel.status,
    },
  });

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const value = e.target.value;
    if (value === "") {
      onChange(null);
    } else {
      const numValue = parseFloat(value);
      onChange(isNaN(numValue) ? null : numValue);
    }
  };

  async function updateDocument(file: File, documentType: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${parcel.id}/${documentType}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("parcel-documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("parcel-documents").getPublicUrl(fileName);

    return publicUrl;
  }

  async function onSubmit(data: EditParcelFormValues) {
    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from("land_parcels")
        .update({
          parcel_name: data.parcel_name,
          total_area: data.total_area,
          cultivable_area: data.cultivable_area,
          gps_coordinates: data.gps_coordinates,
          avg_crop_yield: data.avg_crop_yield,
          avg_residue_yield: data.avg_residue_yield,
          avg_residue_consumption: data.avg_residue_consumption,
          biochar_facility_distance: data.biochar_facility_distance,
          storage_facility_distance: data.storage_facility_distance,
          available_storage_area: data.available_storage_area,
          status: data.status,
        })
        .eq("id", parcel.id);

      if (updateError) throw updateError;

      // Handle document updates
      if (data.new_ownership_proof) {
        const newUrl = await updateDocument(
          data.new_ownership_proof,
          "ownership_proof"
        );
        await supabase
          .from("parcel_documents")
          .update({
            document_url: newUrl,
            verification_status: "pending",
          })
          .eq("parcel_id", parcel.id)
          .eq("document_type", "ownership_proof");
      }

      if (data.new_land_survey) {
        const newUrl = await updateDocument(data.new_land_survey, "map");
        await supabase
          .from("parcel_documents")
          .update({
            document_url: newUrl,
            verification_status: "pending",
          })
          .eq("parcel_id", parcel.id)
          .eq("document_type", "map");
      }

      toast.success("Parcel updated successfully");
      router.push(`/parcels/${parcel.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating parcel:", error);
      toast.error("Failed to update parcel");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the basic details of your parcel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="parcel_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcel Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        value={field.value ?? undefined}
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
              </div>

              <FormField
                control={form.control}
                name="gps_coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Coordinates</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>
                      Format: latitude, longitude
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Area Information */}
          <Card>
            <CardHeader>
              <CardTitle>Area Information</CardTitle>
              <CardDescription>Update area measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
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
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
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
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
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
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormDescription>
                        Available storage area in square meters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Yield Information */}
          <Card>
            <CardHeader>
              <CardTitle>Yield Information</CardTitle>
              <CardDescription>Update yield details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
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
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
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
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
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
                      <FormLabel>
                        Average Residue Consumption (t/year)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormDescription>
                        Average residue consumption in tonnes per year
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Facility Distances */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Distances</CardTitle>
              <CardDescription>Update distance measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
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
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
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
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberInput(e, field.onChange)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormDescription>
                        Distance to storage facility in kilometers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Update Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Update Documents</CardTitle>
              <CardDescription>
                Upload new versions of your documents if needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Documents */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Current Documents</h4>
                <div className="grid gap-4">
                  {parcel.parcel_documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {doc.document_type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doc.document_name || "Document"}
                        </p>
                      </div>
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View Current
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload New Documents */}
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="new_ownership_proof"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Update Ownership Proof</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          className="cursor-pointer"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload new ownership proof document (PDF, JPG, PNG)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_land_survey"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Update Land Survey Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          className="cursor-pointer"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload new land survey document (PDF, JPG, PNG)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="w-[100px]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-[150px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Parcel"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
