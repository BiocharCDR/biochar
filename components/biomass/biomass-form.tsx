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
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BiomassFormProps,
  BiomassFormValues,
  biomassFormSchema,
} from "./schema";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const defaultValues: Partial<BiomassFormValues> = {
  crop_yield: null,
  moisture_content: null,
  quality_grade: null,
  residue_generated: null,
  residue_storage_location: null,
  storage_conditions: null,
  notes: null,
  status: "stored",
};

export function BiomassForm({
  parcels,
  initialData,
  isEdit = false,
}: BiomassFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const form = useForm<BiomassFormValues>({
    resolver: zodResolver(biomassFormSchema),
    defaultValues: initialData || defaultValues,
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
      let storage_proof_url = null;

      // Format the date to ISO string for Supabase
      const biomassData = {
        parcel_id: data.parcel_id,
        crop_type: data.crop_type,
        harvest_date: data.harvest_date.toISOString(), // Convert Date to string
        crop_yield: data.crop_yield,
        moisture_content: data.moisture_content,
        quality_grade: data.quality_grade,
        residue_generated: data.residue_generated,
        residue_storage_location: data.residue_storage_location,
        storage_conditions: data.storage_conditions,
        notes: data.notes,
        status: data.status,
      };

      const { data: biomassRecord, error: insertError } = await supabase
        .from("biomass_production")
        .insert(biomassData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Handle storage proof upload if provided
      if (data.storage_proof) {
        storage_proof_url = await uploadStorageProof(
          data.storage_proof,
          biomassRecord.id
        );

        const { error: updateError } = await supabase
          .from("biomass_production")
          .update({ storage_proof_url })
          .eq("id", biomassRecord.id);

        if (updateError) throw updateError;
      }

      toast.success("Biomass record created successfully");
      router.push("/biomass");
      router.refresh();
    } catch (error) {
      console.error("Error creating biomass record:", error);
      toast.error("Failed to create biomass record");
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
                        value={field.value ?? ""} // Convert null to empty string
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
                        value={field.value ?? ""} // Convert null to empty string
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
              {/*  Quality Grade */}
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

              {/* Residue Generated */}
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
                        value={field.value ?? ""} // Convert null to empty string
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

        {/* Storage Information */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Residue STorage Location */}
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

              {/* Storage Conditions */}
              <FormField
                control={form.control}
                name="storage_conditions"
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

            {/* Storage Proof */}
            <FormField
              control={form.control}
              name="storage_proof"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Storage Proof</FormLabel>
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
                  <FormDescription>
                    Upload photos or documents of storage (PDF or images only)
                  </FormDescription>
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
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes or observations"
                      className="min-h-[100px]"
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
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Update Biomass"
            ) : (
              "Create Biomass"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
