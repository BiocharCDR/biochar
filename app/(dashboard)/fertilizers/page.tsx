// app/fertilisers/page.tsx
import { Metadata } from "next";

import { FertilizerHeader } from "@/components/fertilizers/fertilizer-header";
import { FertilizerTable } from "@/components/fertilizers/fertilizer-table";
import { getFertilizerInventory } from "@/components/fertilizers/action";

export const metadata: Metadata = {
  title: "Fertilizer Inventory",
  description: "Manage your fertilizer inventory and usage",
};

export default async function FertilizersPage() {
  const fertilizers = await getFertilizerInventory();

  return (
    <div className="space-y-6">
      <FertilizerHeader />
      <FertilizerTable data={fertilizers} />
    </div>
  );
}
