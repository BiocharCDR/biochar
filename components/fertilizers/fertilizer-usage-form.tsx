"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

import { createSupabaseBrowser } from "@/lib/supabase/client";
import {
  FertilizerUsageFormProps,
  FertilizerUsageFormValues,
  fertilizerUsageFormSchema,
} from "./schema";

export function FertilizerUsageForm({
  fertilizer,
  landParcels,
  initialData,
  isEdit = false,
}: FertilizerUsageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const defaultValues: Partial<FertilizerUsageFormValues> = {
    parcel_id: "",
    application_date: new Date(),
    quantity_used: 0,
    purpose: null,
    notes: null,
  };

  const form = useForm<FertilizerUsageFormValues>({
    resolver: zodResolver(fertilizerUsageFormSchema),
    defaultValues: initialData || defaultValues,
  });

  async function onSubmit(data: FertilizerUsageFormValues) {
    if (data.quantity_used > fertilizer.quantity) {
      toast.error("Usage quantity cannot exceed available quantity");
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to record fertilizer usage");
        return;
      }

      const usageData = {
        ...data,
        inventory_id: fertilizer.id,
        application_date: data.application_date.toISOString().split("T")[0],
      };

      // Create usage record
      const { error: usageError } = await supabase
        .from("fertilizer_usage")
        .insert(usageData);

      if (usageError) throw usageError;

      // Update inventory quantity
      const { error: updateError } = await supabase
        .from("fertilizer_inventory")
        .update({
          quantity: fertilizer.quantity - data.quantity_used,
          status:
            fertilizer.quantity - data.quantity_used === 0
              ? "out_of_stock"
              : fertilizer.quantity - data.quantity_used < 10
              ? "low_stock"
              : "in_stock",
        })
        .eq("id", fertilizer.id);

      if (updateError) throw updateError;

      toast.success("Usage recorded successfully");
      router.push(`/fertilizers/${fertilizer.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error recording usage:", error);
      toast.error("Failed to record usage");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Record Usage</CardTitle>
            <CardDescription>
              Available Quantity: {fertilizer.quantity} {fertilizer.unit}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
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
                        <SelectValue placeholder="Select land parcel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landParcels.map((parcel) => (
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
              name="application_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Application Date</FormLabel>
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
              name="quantity_used"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Used ({fertilizer.unit})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={`Enter quantity in ${fertilizer.unit}`}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    Must not exceed available quantity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter purpose of application"
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes"
                      className="resize-none"
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
                Recording...
              </>
            ) : (
              "Record Usage"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
