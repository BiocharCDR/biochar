/* eslint-disable */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  BiocharFormProps,
  BiocharFormValues,
  biocharFormSchema,
} from "./schema";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import React from "react";
import { PRODUCTION_STATUS } from "./types";

function generateBatchNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `BC${year}${month}-${randomNum}`;
}

export function BiocharForm({
  biomassRecords,
  initialData,
  isEdit = false,
}: BiocharFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBiomass, setSelectedBiomass] = useState<any>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const defaultValues: BiocharFormValues = {
    biomass_id: "", // Required field
    batch_number: generateBatchNumber(), // Auto-generated
    production_date: new Date(),
    start_time: "",
    end_time: "",
    biomass_weight: 0, // Required field, can't be null
    biochar_weight: null,
    combustion_temperature: null,
    water_usage: null,
    yield_percentage: null,
    quality_parameters: {
      ph_level: null,
      moisture_content: null,
      carbon_content: null,
      ash_content: null,
    },
    production_notes: "",
    status: PRODUCTION_STATUS.IN_PROGRESS,
  };

  const form = useForm<BiocharFormValues>({
    resolver: zodResolver(biocharFormSchema),
    defaultValues: initialData || defaultValues,
  });

  async function onSubmit(data: BiocharFormValues) {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to create a production record");
        return;
      }

      // Check biomass availability for new records
      if (
        !isEdit &&
        selectedBiomass &&
        data.biomass_weight > selectedBiomass.biomass_remaining
      ) {
        toast.error("Requested biomass weight exceeds available quantity");
        return;
      }

      const biocharData = {
        ...data,
        farmer_id: user.id,
        production_date: data.production_date.toISOString().split("T")[0],
      };

      if (isEdit && initialData) {
        // Update existing record
        const { error: updateError, data: updatedBiochar } = await supabase
          .from("biochar_production")
          .update(biocharData)
          .eq("id", initialData.id)
          .select()
          .single();

        if (updateError) throw updateError;

        toast.success("Production record updated successfully");
        router.push(`/biochar/${initialData.id}`);
      } else {
        // Create new record
        const { error: insertError, data: newBiochar } = await supabase
          .from("biochar_production")
          .insert(biocharData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Record biomass usage for new records
        await handleBiomassUsage(
          newBiochar.id,
          data.biomass_id,
          data.biomass_weight
        );

        toast.success("Production record created successfully");
        router.push("/biochar");
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving production record:", error);
      toast.error(
        `Failed to ${isEdit ? "update" : "create"} production record`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Watch biomass weight for yield calculation
  const biomassWeight = form.watch("biomass_weight");
  const biocharWeight = form.watch("biochar_weight");

  // Calculate yield percentage when weights change
  useEffect(() => {
    const currentBiomassId = form.getValues("biomass_id");
    if (currentBiomassId) {
      const biomass = biomassRecords.find((r) => r.id === currentBiomassId);
      setSelectedBiomass(biomass);
    }
  }, [form, biomassRecords]);

  const handleBiomassUsage = async (
    biocharId: string,
    biomassId: string,
    quantityUsed: number
  ) => {
    const { error } = await supabase.from("biomass_usage").insert({
      biochar_id: biocharId,
      biomass_id: biomassId,
      quantity_used: quantityUsed,
      usage_date: new Date().toISOString().split("T")[0],
    });

    if (error) throw error;
  };

  useEffect(() => {
    if (biomassWeight && biocharWeight) {
      const yieldPercentage = (biocharWeight / biomassWeight) * 100;
      form.setValue("yield_percentage", yieldPercentage);
    }
  }, [biomassWeight, biocharWeight, form]);

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
                name="biomass_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biomass Source</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const biomass = biomassRecords.find(
                          (r) => r.id === value
                        );
                        setSelectedBiomass(biomass);
                      }}
                      defaultValue={field.value}
                      disabled={isEdit}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select biomass source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {biomassRecords.map((record) => (
                          <SelectItem
                            key={record.id}
                            value={record.id!}
                            disabled={!isEdit && record.biomass_remaining! <= 0}
                          >
                            {record.displayName ||
                              `${record.crop_type} (${format(
                                new Date(record.harvest_date!),
                                "PP"
                              )})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedBiomass && !isEdit && (
                      <FormDescription>
                        Available:{" "}
                        {selectedBiomass.biomass_remaining.toFixed(2)} kg
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isEdit} />
                    </FormControl>
                    <FormDescription>
                      Auto-generated unique batch number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="production_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Production Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
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
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Production Details */}
        <Card>
          <CardHeader>
            <CardTitle>Production Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="biomass_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biomass Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter weight"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          if (
                            !isEdit &&
                            selectedBiomass &&
                            value > selectedBiomass.biomass_remaining
                          ) {
                            toast.error("Weight exceeds available biomass");
                            return;
                          }
                          field.onChange(value);
                        }}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormDescription>
                      Total weight of biomass used
                      {!isEdit && selectedBiomass && (
                        <span className="block text-xs text-muted-foreground">
                          Maximum available:{" "}
                          {selectedBiomass.biomass_remaining.toFixed(2)} kg
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biochar_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biochar Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter weight"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>Total biochar produced</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="combustion_temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter temperature"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="water_usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Usage (L)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Enter water usage"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yield_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yield (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        disabled
                        {...field}
                        value={field.value?.toFixed(1) ?? ""}
                      />
                    </FormControl>
                    <FormDescription>Auto-calculated yield</FormDescription>
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
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Enter pH"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>pH level (0-14)</FormDescription>
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
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
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="production_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Notes</FormLabel>
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Status</FormLabel>
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
                      <SelectItem value={PRODUCTION_STATUS.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={PRODUCTION_STATUS.COMPLETED}>
                        Completed
                      </SelectItem>
                      <SelectItem value={PRODUCTION_STATUS.FAILED}>
                        Failed
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
              "Update Production"
            ) : (
              "Create Production"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
