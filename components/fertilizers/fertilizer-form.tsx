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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";

import {
  FertilizerFormProps,
  FertilizerFormValues,
  fertilizerFormSchema,
  FERTILIZER_TYPES,
  FERTILIZER_UNITS,
  FERTILIZER_STATUS,
} from "./schema";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export function FertilizerForm({
  initialData,
  isEdit = false,
}: FertilizerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const defaultValues: Partial<FertilizerFormValues> = {
    name: "",
    fertilizer_type: "chemical",
    manufacturer: null,
    batch_number: null,
    quantity: 0,
    unit: "",
    purchase_date: new Date(),
    purchase_proof: null,
    status: "in_stock",
  };

  const form = useForm<FertilizerFormValues>({
    resolver: zodResolver(fertilizerFormSchema),
    defaultValues: initialData || defaultValues,
  });

  async function onSubmit(data: FertilizerFormValues) {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to manage fertilizer records");
        return;
      }

      let purchase_proof_url = initialData?.purchase_proof_url;

      // Handle file upload if there's a new file
      if (data.purchase_proof) {
        // If editing and there's an existing file, delete it first
        if (isEdit && initialData?.purchase_proof_url) {
          const existingPath = initialData.purchase_proof_url.split("/").pop();
          if (existingPath) {
            await supabase.storage
              .from("fertilizers")
              .remove([`${user.id}/${existingPath}`]);
          }
        }

        const fileExt = data.purchase_proof.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("fertilizers")
          .upload(fileName, data.purchase_proof);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("fertilizers").getPublicUrl(fileName);

        purchase_proof_url = publicUrl;
      }

      const fertilizerData = {
        ...data,
        farmer_id: user.id,
        purchase_date: data.purchase_date.toISOString().split("T")[0],
        purchase_proof_url,
      };

      // Remove the file object before sending to Supabase
      delete (fertilizerData as any).purchase_proof;

      if (isEdit && initialData?.id) {
        const { error: updateError } = await supabase
          .from("fertilizer_inventory")
          .update(fertilizerData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;

        toast.success("Fertilizer record updated successfully");
        router.push(`/fertilizers/${initialData.id}`);
      } else {
        const { error: insertError } = await supabase
          .from("fertilizer_inventory")
          .insert(fertilizerData);

        if (insertError) throw insertError;

        toast.success("Fertilizer record created successfully");
        router.push("/fertilizers");
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving fertilizer record:", error);
      toast.error(
        `Failed to ${isEdit ? "update" : "create"} fertilizer record`
      );
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fertilizer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter fertilizer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fertilizer_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FERTILIZER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter manufacturer name"
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
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter batch number"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Purchase Details */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
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
                name="purchase_proof"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Purchase Proof</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file || null);
                          }}
                          {...field}
                        />
                        {initialData?.purchase_proof_url && !value && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FileText className="mr-2 h-4 w-4" />
                            Current file:
                            <a
                              href={initialData.purchase_proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-1 hover:underline"
                            >
                              View
                            </a>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload purchase receipt or proof (PDF or Image)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FERTILIZER_UNITS.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
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

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Status</FormLabel>
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
                      {FERTILIZER_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
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
              "Update Fertilizer"
            ) : (
              "Create Fertilizer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
