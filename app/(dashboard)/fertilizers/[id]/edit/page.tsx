import { getFertilizerById } from "@/components/fertilizers/action";
import { FertilizerForm } from "@/components/fertilizers/fertilizer-form";
import { initialDataType } from "@/components/fertilizers/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Fertilizer",
  description: "Edit fertilizer details",
};

export default async function EditFertilizerPage({
  params,
}: {
  params: { id: string };
}) {
  const fertilizer = await getFertilizerById(params.id);

  if (!fertilizer) {
    notFound();
  }

  const initialData = {
    ...fertilizer,
    purchase_date: new Date(fertilizer.purchase_date),
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/fertilizers" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Fertilizers
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mt-4">
          Edit Fertilizer
        </h1>
        <p className="text-muted-foreground">
          Update the details for {fertilizer.name}
        </p>
      </div>
      <FertilizerForm
        initialData={initialData as initialDataType}
        isEdit={true}
      />
    </div>
  );
}
