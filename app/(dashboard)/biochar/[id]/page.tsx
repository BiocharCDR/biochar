import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";

import {
  getBiocharProductionById,
  getBiocharStorageByBiocharId,
} from "@/components/biochar/action";
import BiocharDetailHeader from "@/components/biochar/biochar-detail-header";
import BiocharProductionInfo from "@/components/biochar/biochar-production-info";

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
    <div className="space-y-6">
      <BiocharDetailHeader biochar={biocharProduction} />
      <Separator />
      <div className="">
        <BiocharProductionInfo biochar={biocharProduction} />
      </div>
    </div>
  );
}
