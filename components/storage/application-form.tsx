"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  ApplicationFormProps,
  ApplicationFormValues,
  APPLICATION_METHODS,
  SOIL_CONDITIONS,
  WEATHER_CONDITIONS,
  applicationFormSchema,
} from "./schema";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { FertilizerInventory } from "@/types";

export function ApplicationForm({
  storage,
  parcels,
  fertilizers,
  initialData,
  isEdit = false,
}: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] =
    useState<FertilizerInventory | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: initialData || {
      application_date: new Date(),
      parcel_id: "",
      quantity_used: 0,
      application_method: null,
      area_covered: null,
      soil_conditions: null,
      weather_conditions: null,
      fertilizer_id: null,
      fertilizer_quantity: null,
      mixture_ratio: null,
      notes: null,
    },
  });

  // Watch form values for fertilizer calculations
  const fertilizerId = form.watch("fertilizer_id");
  const fertilizerQuantity = form.watch("fertilizer_quantity");
  const biocharQuantity = form.watch("quantity_used");

  // Update selected fertilizer when ID changes
  useEffect(() => {
    if (fertilizerId) {
      const fertilizer = fertilizers.find((f) => f.id === fertilizerId);
      setSelectedFertilizer(fertilizer || null);
    } else {
      setSelectedFertilizer(null);
      // Clear fertilizer related fields when no fertilizer is selected
      form.setValue("fertilizer_quantity", null);
      form.setValue("mixture_ratio", null);
    }
  }, [fertilizerId, fertilizers, form]);

  // Calculate mixture ratio when quantities change
  useEffect(() => {
    if (biocharQuantity && fertilizerQuantity) {
      const ratio = `${biocharQuantity}:${fertilizerQuantity}`;
      form.setValue("mixture_ratio", ratio);
    } else {
      form.setValue("mixture_ratio", null);
    }
  }, [biocharQuantity, fertilizerQuantity, form]);

  async function onSubmit(data: ApplicationFormValues) {
    if (!data.parcel_id) {
      toast.error("Please select a land parcel");
      return;
    }

    if (data.quantity_used <= 0) {
      toast.error("Application quantity must be greater than 0");
      return;
    }

    if (data.quantity_used > storage.quantity_remaining) {
      toast.error("Application quantity cannot exceed available quantity");
      return;
    }

    // Fertilizer validation
    if (data.fertilizer_id) {
      if (!data.fertilizer_quantity || data.fertilizer_quantity <= 0) {
        toast.error("Please specify fertilizer quantity");
        return;
      }

      if (
        selectedFertilizer &&
        data.fertilizer_quantity > selectedFertilizer.quantity
      ) {
        toast.error("Fertilizer quantity cannot exceed available quantity");
        return;
      }
    }

    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // Start a transaction
      const { data: application, error: applicationError } = await supabase
        .from("biochar_application")
        .insert({
          storage_id: storage.id,
          parcel_id: data.parcel_id,
          application_date: data.application_date.toISOString().split("T")[0],
          quantity_used: data.quantity_used,
          application_method: data.application_method,
          area_covered: data.area_covered,
          weather_conditions: data.weather_conditions,
          soil_conditions: data.soil_conditions,
          fertilizer_id: data.fertilizer_id,
          fertilizer_quantity: data.fertilizer_quantity,
          mixture_ratio: data.mixture_ratio,
          notes: data.notes,
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      // 2. If fertilizer is used, create usage record
      if (
        data.fertilizer_id &&
        data.fertilizer_quantity &&
        selectedFertilizer
      ) {
        // Update fertilizer inventory
        const newQuantity =
          selectedFertilizer.quantity - data.fertilizer_quantity;
        const { error: fertilizerError } = await supabase
          .from("fertilizer_inventory")
          .update({
            quantity: newQuantity,
            status:
              newQuantity === 0
                ? "out_of_stock"
                : newQuantity < selectedFertilizer.quantity * 0.2
                ? "low_stock"
                : "in_stock",
          })
          .eq("id", data.fertilizer_id);

        if (fertilizerError) throw fertilizerError;

        // Record fertilizer usage
        const { error: usageError } = await supabase
          .from("fertilizer_usage")
          .insert({
            inventory_id: data.fertilizer_id,
            parcel_id: data.parcel_id,
            quantity_used: data.fertilizer_quantity,
            application_date: data.application_date.toISOString().split("T")[0],
            purpose: `${storage.biochar.batch_number} - ${application.application_method} `,
            notes: data.notes,
          });

        if (usageError) throw usageError;
      }

      // 3. Update biochar storage quantity and status
      const remainingQuantity = storage.quantity_remaining - data.quantity_used;
      const { error: storageError } = await supabase
        .from("biochar_storage")
        .update({
          quantity_remaining: remainingQuantity,
          status: remainingQuantity === 0 ? "depleted" : "in_use",
        })
        .eq("id", storage.id);

      if (storageError) throw storageError;

      toast.success("Application recorded successfully");
      router.push(`/storage/${storage.id}`);
      router.refresh();
    } catch (error: any) {
      console.error("Error recording application:", error);
      toast.error(error.message || "Failed to record application");
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
            <CardTitle>Application Details</CardTitle>
            <CardDescription>
              Available quantity: {storage.quantity_remaining} kg
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Date and Parcel Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="application_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Application Date</FormLabel>
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
            </div>

            {/* Quantities and Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity_used"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Used (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        max={storage.quantity_remaining}
                        {...field}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const value =
                            rawValue === "" ? 0 : parseFloat(rawValue);

                          if (isNaN(value) || rawValue === "") {
                            field.onChange(0);
                            return;
                          }

                          if (value > storage.quantity_remaining) {
                            toast.error("Exceeds available quantity");
                            field.onChange(0);
                            return;
                          }

                          if (value < 0) {
                            field.onChange(0);
                            return;
                          }

                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Available: {storage.quantity_remaining} kg
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_covered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Covered (hectares)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter area covered"
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

            <FormField
              control={form.control}
              name="application_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {APPLICATION_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Fertilizer Mixing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Fertilizer Mixing</CardTitle>
            <CardDescription>
              Mix biochar with fertilizer during application
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="fertilizer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Fertilizer (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fertilizer to mix" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fertilizers.map((fertilizer) => (
                        <SelectItem
                          key={fertilizer.id}
                          value={fertilizer.id}
                          disabled={fertilizer.quantity <= 0}
                        >
                          {fertilizer.name} ({fertilizer.quantity}{" "}
                          {fertilizer.unit} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedFertilizer && (
              <FormField
                control={form.control}
                name="fertilizer_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Fertilizer Quantity ({selectedFertilizer.unit})
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value > selectedFertilizer.quantity) {
                            toast.error(
                              "Exceeds available fertilizer quantity"
                            );
                            return;
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Available: {selectedFertilizer.quantity}{" "}
                      {selectedFertilizer.unit}
                    </FormDescription>
                    {form.watch("mixture_ratio") && (
                      <FormDescription>
                        Mixture Ratio (Biochar:Fertilizer) -{" "}
                        {form.watch("mixture_ratio")}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Application Conditions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="soil_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Conditions</FormLabel>
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
                        {SOIL_CONDITIONS.map((condition) => (
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

              <FormField
                control={form.control}
                name="weather_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Conditions</FormLabel>
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
                        {WEATHER_CONDITIONS.map((condition) => (
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              "Record Application"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
