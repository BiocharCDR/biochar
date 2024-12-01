// app/biochar/[id]/edit/page.tsx
import {
  getBiocharProductionById,
  getBiomassRecords,
} from "@/components/biochar/action";
import { BiocharForm } from "@/components/biochar/biochar-form";
import { BiocharFormValues } from "@/components/biochar/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Biochar Production",
  description: "Edit biochar production details",
};

export default async function EditBiocharPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch the existing biochar production record
  const biocharProduction = await getBiocharProductionById(params.id);

  if (!biocharProduction) {
    notFound();
  }

  // Fetch biomass records for the dropdown
  const biomassRecords = await getBiomassRecords();

  const initialData = {
    ...biocharProduction,
    production_date: new Date(biocharProduction.production_date),
  };

  return (
    <div className="space-y-6">
      <Link href="/biochar">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>
      <div>
        <h3 className="text-lg font-medium">Edit Biochar Production</h3>
        <p className="text-sm text-muted-foreground">
          Update the biochar production details for batch #
          {biocharProduction.batch_number}
        </p>
      </div>
      <BiocharForm
        biomassRecords={biomassRecords}
        initialData={initialData as BiocharFormValues & { id: string }}
        isEdit={true}
      />
    </div>
  );
}
