import {
  getFertilizerById,
  getLandParcels,
} from "@/components/fertilizers/action";
import { FertilizerUsageForm } from "@/components/fertilizers/fertilizer-usage-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Record Fertilizer Usage",
  description: "Record fertilizer application details",
};

export default async function RecordUsagePage({
  params,
}: {
  params: { id: string };
}) {
  const [fertilizer, landParcels] = await Promise.all([
    getFertilizerById(params.id),
    getLandParcels(),
  ]);

  if (!fertilizer) {
    notFound();
  }

  if (fertilizer.status === "out_of_stock") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Record Fertilizer Usage</h3>
        <p className="text-sm text-muted-foreground">
          Record application details for {fertilizer.name}
        </p>
      </div>
      <FertilizerUsageForm fertilizer={fertilizer} landParcels={landParcels} />
    </div>
  );
}
