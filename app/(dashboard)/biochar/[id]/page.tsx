// app/(dashboard)/biochar/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  getBiocharProductionById,
  getBiocharStorageByBiocharId,
} from "@/components/biochar/action";
import BiocharDetailHeader from "@/components/biochar/biochar-detail-header";
import BiocharProductionInfo from "@/components/biochar/biochar-production-info";

import BiocharStorageInfo from "@/components/biochar/biochar-storage-info";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BiocharQualityInfo from "@/components/biochar/biochar-quality-info";
import BiocharStatusTimeline from "@/components/biochar/biochar-status-timeline";

export const metadata: Metadata = {
  title: "Biochar Production Details",
  description: "View detailed information about biochar production",
};

export default async function BiocharDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const biocharProduction = await getBiocharProductionById(params.id);

  if (!biocharProduction) {
    notFound();
  }

  const biocharStorage = await getBiocharStorageByBiocharId(params.id);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BiocharDetailHeader biochar={biocharProduction} />
      <Separator />

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <BiocharProductionInfo biochar={biocharProduction} />
          <BiocharQualityInfo biochar={biocharProduction} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <BiocharStorageInfo storage={biocharStorage} />
          <BiocharStatusTimeline biochar={biocharProduction} />
        </div>
      </div>
    </div>
  );
}
