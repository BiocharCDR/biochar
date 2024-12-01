import { getFertilizerById } from "@/components/fertilizers/action";
import { FertilizerForm } from "@/components/fertilizers/fertilizer-form";
import { initialDataType } from "@/components/fertilizers/schema";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Metadata } from "next";
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
      <div>
        <Link href="/fertilizers" className="mb-4">
          <Button variant="ghost">← Back</Button>
        </Link>
        <h3 className="text-lg font-medium">Edit Fertilizer</h3>
        <p className="text-sm text-muted-foreground">
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
