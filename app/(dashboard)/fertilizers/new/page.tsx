import { FertilizerForm } from "@/components/fertilizers/fertilizer-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Add New Fertilizer",
  description: "Add a new fertilizer to your inventory",
};

export default function NewFertilizerPage() {
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
          Add New Fertilizer
        </h1>
        <p className="text-muted-foreground">
          Add a new fertilizer to your inventory and track its usage
        </p>
      </div>

      <FertilizerForm />
    </div>
  );
}
