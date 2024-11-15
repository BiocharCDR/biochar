"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  CERTIFICATION_TYPES,
  CERTIFICATION_DATA,
  CertificationType,
  getBuildingTypes,
  getTargetLevels,
} from "@/types/project";

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  client: z.string().min(1, "Client name is required"),
  certification: z.enum(CERTIFICATION_TYPES, {
    required_error: "Please select a certification",
  }),
  buildingType: z.string().min(1, "Building type is required"),
  floorArea: z.coerce.number().positive("Floor area must be positive"),
  floorAreaUnit: z.enum(["sqm", "sqft"]),
  targetLevel: z.string().min(1, "Target level is required"),
  contractValue: z.coerce.number().positive("Contract value must be positive"),
  currency: z.enum(["SGD", "MYR", "IDR", "USD"]),
  documents: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files) return true;
      return Array.from(files).every((file) => file.type === "application/pdf");
    }, "Only PDF files are allowed"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<FormValues> = {
  floorAreaUnit: "sqm",
  currency: "SGD",
};

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedCertification = form.watch("certification");

  // Reset dependent fields when certification changes
  useEffect(() => {
    if (selectedCertification) {
      form.setValue("buildingType", "");
      form.setValue("targetLevel", "");
    }
  }, [selectedCertification, form]);

  async function uploadFiles(files: FileList | null): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const supabase = createSupabaseBrowser();
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        continue;
      }

      const fileExt = "pdf";
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { data, error } = await supabase.storage
        .from("project-documents")
        .upload(filePath, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      if (data) {
        uploadedUrls.push(filePath);
      }
    }

    return uploadedUrls;
  }

  async function onSubmit(values: FormValues) {
    try {
      setIsUploading(true);
      const supabase = createSupabaseBrowser();

      // Upload documents if any
      const documentUrls = await uploadFiles(values.documents || null);

      // Create project in database
      const { error } = await supabase.from("projects").insert({
        name: values.projectName,
        client: values.client,
        certification: values.certification,
        building_type: values.buildingType,
        floor_area: values.floorArea,
        floor_area_unit: values.floorAreaUnit,
        target_level: values.targetLevel,
        contract_value: values.contractValue,
        currency: values.currency,
        documents: documentUrls,
        status: "Active",
        progress: 0,
      });

      if (error) throw error;

      toast.success("Project created successfully");
      setOpen(false);
      form.reset(defaultValues);
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset(defaultValues);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CERTIFICATION_TYPES.map((cert) => (
                        <SelectItem key={cert} value={cert}>
                          {cert}
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
              name="buildingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Building</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedCertification}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCertification &&
                        getBuildingTypes(selectedCertification).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="floorArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Floor Area</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="floorAreaUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="sqft">sqft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contractValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SGD">SGD</SelectItem>
                        <SelectItem value="MYR">MYR</SelectItem>
                        <SelectItem value="IDR">IDR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="targetLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedCertification}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCertification &&
                        getTargetLevels(selectedCertification).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
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
              name="documents"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem className="">
                  <FormLabel>Documents</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => onChange(e.target.files)}
                      className="border border-primary text-primary"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>Upload PDF documents only</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
