import { FertilizerForm } from "@/components/fertilizers/fertilizer-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Fertilizer",
  description: "Add a new fertilizer to your inventory",
};

export default function NewFertilizerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Add New Fertilizer</h3>
        <p className="text-sm text-muted-foreground">
          Add a new fertilizer to your inventory and track its usage
        </p>
      </div>
      <FertilizerForm />
    </div>
  );
}
