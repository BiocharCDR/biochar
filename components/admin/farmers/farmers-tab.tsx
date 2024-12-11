"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { FarmerOverview } from "./farmer-overview";
import { FarmerParcels } from "./farmer-parcels";
import { FarmerProduction } from "./farmer-production";
import { FarmerInventory } from "./farmer-inventory";
import { FarmerDocuments } from "./farmer-document";

interface FarmerTabsProps {
  farmerId: string;
}

export function FarmerTabs({ farmerId }: FarmerTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="border-b">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="w-full inline-flex h-10 items-center justify-start rounded-none border-none border-transparent bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="parcels"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Land Parcels
            </TabsTrigger>
            <TabsTrigger
              value="production"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Production
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Activity
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <FarmerOverview farmerId={farmerId} />
      </TabsContent>
      <TabsContent value="parcels" className="space-y-4">
        <FarmerParcels farmerId={farmerId} />
      </TabsContent>
      <TabsContent value="production" className="space-y-4">
        <FarmerProduction farmerId={farmerId} />
      </TabsContent>
      <TabsContent value="inventory" className="space-y-4">
        <FarmerInventory farmerId={farmerId} />
      </TabsContent>
      <TabsContent value="documents" className="space-y-4">
        <FarmerDocuments farmerId={farmerId} />
      </TabsContent>
      <TabsContent value="activity" className="space-y-4">
        {/* <FarmerActivity farmerId={farmerId} /> */}
      </TabsContent>
    </Tabs>
  );
}
