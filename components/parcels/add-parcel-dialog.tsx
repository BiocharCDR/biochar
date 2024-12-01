"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { createSupabaseBrowser } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

// Form Schema
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
  status: z.enum(["active", "inactive"]),
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
  status: "active",
};

export default function AddParcelDialog() {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const form = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelFormSchema),
    defaultValues,
  });

  async function uploadDocument(
    file: File,
    parcelId: string,
    documentType: string
  ) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${parcelId}/${documentType}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("parcel-documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("parcel-documents").getPublicUrl(fileName);

    return publicUrl;
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

      // First, create the parcel
      const { data: parcel, error: parcelError } = await supabase
        .from("land_parcels")
        .insert({
          parcel_name: data.parcel_name,
          total_area: data.total_area,
          cultivable_area: data.cultivable_area,
          gps_coordinates: data.gps_coordinates,
          avg_crop_yield: data.avg_crop_yield,
          status: data.status,
          available_storage_area: data.cultivable_area,
          avg_residue_consumption: 0,
          biochar_facility_distance: 0,
          avg_residue_yield: 0,
          shape_file_url: "",
          storage_facility_distance: 0,
          farmer_id: user.id,
          verification_status: "pending",
        })
        .select()
        .single();

      if (parcelError) throw parcelError;

      // Upload documents and create document records
      const documents = [
        { file: data.ownership_proof, type: "ownership_proof" },
        { file: data.land_survey_document, type: "land_survey" },
      ];

      for (const doc of documents) {
        const publicUrl = await uploadDocument(doc.file, parcel.id, doc.type);

        const { error: docError } = await supabase
          .from("parcel_documents")
          .insert({
            parcel_id: parcel.id,
            document_type: doc.type,
            document_url: publicUrl,
            verification_status: "pending",
          });

        if (docError) throw docError;
      }

      toast.success("Parcel added successfully and pending verification");
      setOpen(false);
      form.reset(defaultValues);
      router.refresh();
    } catch (error) {
      console.error("Error adding parcel:", error);
      toast.error("Failed to add parcel");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Parcel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Land Parcel</DialogTitle>
          <DialogDescription>
            Fill in the details for your new land parcel. All fields are
            required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormDescription>Area in hectares</FormDescription>
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
                      Yield in tonnes per hectare
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card className="col-span-2 bg-primary/5 border-dashed border-primary/50">
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>
                    Please upload the following documents for verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Parcel</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
