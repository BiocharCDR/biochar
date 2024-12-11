"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileText, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { BiomassFormValues, biomassFormSchema } from "./schema";
import { BiomassProduction } from "@/types";

// Type for parcel data
interface Parcel {
  id: string;
  parcel_name: string;
}

// Props interface for the BiomassEditForm component
interface BiomassEditFormProps {
  parcels: Parcel[];
  initialData: BiomassProduction;
}

export const BiomassEditForm: React.FC<BiomassEditFormProps> = ({
  parcels,
  initialData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const form = useForm<BiomassFormValues>({
    resolver: zodResolver(biomassFormSchema),
    defaultValues: {
      ...initialData,
      harvest_date: new Date(initialData.harvest_date),
      biomass_storage_date: initialData.biomass_storage_date
        ? new Date(initialData.biomass_storage_date)
        : null,
      residue_storage_date: initialData.residue_storage_date
        ? new Date(initialData.residue_storage_date)
        : null,
      status:
        (initialData.status as "stored" | "in_process" | "used") || "stored",
    },
  });

  async function uploadStorageProof(file: File, biomassId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${biomassId}/storage_proof.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("biomass-documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("biomass-documents").getPublicUrl(fileName);

    return publicUrl;
  }

  async function onSubmit(data: BiomassFormValues) {
    setIsSubmitting(true);
    try {
      let biomass_storage_proof_url = initialData.biomass_storage_proof_url;
      let residue_storage_proof_url = initialData.residue_storage_proof_url;

      // Handle biomass storage proof upload if new file is provided
      if (data.biomass_storage_proof) {
        // Delete old file if exists
        if (initialData.biomass_storage_proof_url) {
          const oldFileKey = initialData.biomass_storage_proof_url
            .split("/")
            .pop();
          if (oldFileKey) {
            await supabase.storage
              .from("biomass-documents")
              .remove([`${initialData.id}/${oldFileKey}`]);
          }
        }
        biomass_storage_proof_url = await uploadStorageProof(
          data.biomass_storage_proof,
          initialData.id
        );
      }

      // Handle residue storage proof upload if new file is provided
      if (data.residue_storage_proof) {
        if (initialData.residue_storage_proof_url) {
          const oldFileKey = initialData.residue_storage_proof_url
            .split("/")
            .pop();
          if (oldFileKey) {
            await supabase.storage
              .from("biomass-documents")
              .remove([`${initialData.id}/${oldFileKey}`]);
          }
        }
        residue_storage_proof_url = await uploadStorageProof(
          data.residue_storage_proof,
          initialData.id
        );
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Update record with all fields
      const { error: updateError } = await supabase
        .from("biomass_production")
        .update({
          parcel_id: data.parcel_id,
          farmer_id: user.user?.id,
          crop_type: data.crop_type,
          harvest_date: data.harvest_date.toISOString(),
          crop_yield: data.crop_yield,
          moisture_content: data.moisture_content,
          quality_grade: data.quality_grade,
          // Biomass Storage
          biomass_quantity: data.biomass_quantity,
          biomass_storage_location: data.biomass_storage_location,
          biomass_storage_date:
            data.biomass_storage_date?.toISOString() ?? null,
          biomass_storage_conditions: data.biomass_storage_conditions,
          biomass_storage_proof_url,
          // Residue Storage
          residue_generated: data.residue_generated,
          residue_storage_location: data.residue_storage_location,
          residue_storage_date:
            data.residue_storage_date?.toISOString() ?? null,
          residue_storage_conditions: data.residue_storage_conditions,
          residue_storage_proof_url,
          notes: data.notes,
          status: data.status,
        })
        .eq("id", initialData.id);

      if (updateError) throw updateError;

      toast.success("Biomass record updated successfully");
      router.push(`/biomass/${initialData.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating biomass record:", error);
      toast.error("Failed to update biomass record");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parcel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Land Parcel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parcel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parcels.map((parcel) => (
                          <SelectItem key={parcel.id} value={parcel.id}>
                            {parcel.parcel_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crop_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rice, Wheat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="harvest_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Harvest Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        <SelectItem value="stored">Stored</SelectItem>
                        <SelectItem value="in_process">In Process</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                      </SelectContent>
                    </Select>
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
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="crop_yield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Yield (tonnes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter yield"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : null);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormDescription>Total yield in tonnes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="moisture_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moisture Content (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter moisture content"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : null);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormDescription>Moisture percentage</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quality_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quality Grade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">Grade A</SelectItem>
                        <SelectItem value="B">Grade B</SelectItem>
                        <SelectItem value="C">Grade C</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residue_generated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residue Generated (tonnes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter residue amount"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : null);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of residue in tonnes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Biomass Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Biomass Storage</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="biomass_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biomass Quantity (tonnes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter quantity"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biomass_storage_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biomass_storage_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter storage location"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Where the biomass is stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biomass_storage_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Conditions</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select conditions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dry">Dry Storage</SelectItem>
                        <SelectItem value="cold">Cold Storage</SelectItem>
                        <SelectItem value="ambient">Ambient</SelectItem>
                        <SelectItem value="controlled">
                          Climate Controlled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current storage conditions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="biomass_storage_proof"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Storage Proof</FormLabel>
                  <div className="space-y-2">
                    {initialData.biomass_storage_proof_url && !value && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Current Document</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" asChild>
                          <a
                            href={initialData.biomass_storage_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Button>
                      </div>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Residue Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Residue Storage</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="residue_storage_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter storage location"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Where the biomass is stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residue_storage_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Conditions</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select conditions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dry">Dry Storage</SelectItem>
                        <SelectItem value="cold">Cold Storage</SelectItem>
                        <SelectItem value="ambient">Ambient</SelectItem>
                        <SelectItem value="controlled">
                          Climate Controlled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current storage conditions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residue_storage_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="residue_storage_proof"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Storage Proof</FormLabel>
                  <div className="space-y-2">
                    {initialData.residue_storage_proof_url && !value && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Current Document</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" asChild>
                          <a
                            href={initialData.residue_storage_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Button>
                      </div>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes or observations"
                      className="min-h-[100px] resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Biomass"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
