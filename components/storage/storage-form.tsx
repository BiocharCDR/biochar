"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import {
  StorageFormProps,
  StorageFormValues,
  storageFormSchema,
  STORAGE_CONDITIONS,
} from "./schema";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface BiocharBatch {
  id: string;
  batch_number: string;
  biochar_weight: number;
  production_date: string;
  biomass_id: string;
  displayName: string;
}

export function StorageForm({
  biocharBatches,
  initialData,
  isEdit = false,
}: StorageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const params = useParams();

  const defaultValues: Partial<StorageFormValues> = {
    biochar_id: "",
    storage_location: "",
    storage_date: new Date(),
    quantity_stored: 0,
    storage_conditions: null,
    quality_check_date: null,
    quality_parameters: {
      ph_level: null,
      moisture_content: null,
      carbon_content: null,
      ash_content: null,
    },
    status: "stored",
  };

  const form = useForm<StorageFormValues>({
    resolver: zodResolver(storageFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Watch biochar_id and mixed_with_fertilizer to handle dependencies
  const selectedBiocharId = form.watch("biochar_id");

  const selectedBatch = biocharBatches.find(
    (batch) => batch.id === selectedBiocharId
  );

  async function onSubmit(data: StorageFormValues) {
    // Validate user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to create a storage record");
      return;
    }

    // Validate storage quantity
    if (
      !isEdit &&
      selectedBatch &&
      data.quantity_stored > (selectedBatch.biochar_weight || 0)
    ) {
      toast.error("Storage quantity cannot exceed produced biochar weight");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the data for Supabase
      const formattedData = {
        biochar_id: data.biochar_id,
        farmer_id: user.id,
        storage_location: data.storage_location,
        storage_date: data.storage_date.toISOString().split("T")[0],
        quantity_stored: selectedBatch?.biochar_weight || 0, // Use the biochar weight directly
        quantity_remaining: selectedBatch?.biochar_weight || 0, // Initialize remaining quantity
        storage_conditions: data.storage_conditions,
        quality_check_date: data.quality_check_date
          ? data.quality_check_date.toISOString().split("T")[0]
          : null,
        quality_parameters: data.quality_parameters,
        status: data.status,
      };

      if (isEdit && params.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("biochar_storage")
          .update(formattedData)
          .eq("id", params.id);

        if (updateError) throw updateError;

        toast.success("Storage record updated successfully");
        router.push(`/storage/${params.id}`);
      } else {
        // Create new record
        const { data: newRecord, error: insertError } = await supabase
          .from("biochar_storage")
          .insert(formattedData)
          .select("id")
          .single();

        if (insertError) throw insertError;

        toast.success("Storage record created successfully");
        router.push(`/storage/${newRecord.id}`);
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving storage record:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} storage record`);
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
            <FormField
              control={form.control}
              name="biochar_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biochar Batch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {biocharBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch?.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBatch && (
                    <FormDescription>
                      Available quantity: {selectedBatch.biochar_weight}kg
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storage_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
                name="storage_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter storage location" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where the biochar is stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity_stored"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={selectedBatch?.biochar_weight || 0}
                        disabled
                        // {...field}
                      />
                    </FormControl>
                    {selectedBatch && (
                      <FormDescription>
                        Maximum available: {selectedBatch.biochar_weight}kg
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {STORAGE_CONDITIONS.map((condition) => (
                          <SelectItem
                            key={condition.value}
                            value={condition.value}
                          >
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quality Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Parameters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="quality_check_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Quality Check Date</FormLabel>
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
                        selected={field.value || undefined}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quality_parameters.ph_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>pH Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter pH level"
                        {...field}
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
                name="quality_parameters.moisture_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moisture Content (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter moisture content"
                        {...field}
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
                name="quality_parameters.carbon_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carbon Content (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter carbon content"
                        {...field}
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
                name="quality_parameters.ash_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ash Content (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter ash content"
                        {...field}
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
            </div>
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
                {isEdit ? "Updating..." : "Create Record"}
              </>
            ) : isEdit ? (
              "Update Record"
            ) : (
              "Create Record"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
