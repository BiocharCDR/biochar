// app/fertilisers/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import {
  getFertilizerById,
  getFertilizerUsageById,
} from "@/components/fertilizers/action";
import FertilizerInfo from "@/components/fertilizers/fertilizer-info";
import FertilizerUsage from "@/components/fertilizers/fertilizer-usage";
import FertilizerDetailHeader from "@/components/fertilizers/fertlizer-featil-header";

export const metadata: Metadata = {
  title: "Fertilizer Details",
  description: "View detailed information about fertilizer inventory",
};

export default async function FertilizerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const fertilizer = await getFertilizerById(params.id);

  if (!fertilizer) {
    notFound();
  }

  const usageRecords = await getFertilizerUsageById(params.id);

  return (
    <div className="space-y-6">
      <FertilizerDetailHeader fertilizer={fertilizer} />
      <Separator />
      <div className="grid gap-6 md:grid-cols-2">
        <FertilizerInfo fertilizer={fertilizer} />
        <FertilizerUsage usageRecords={usageRecords} />
      </div>
    </div>
  );
}
