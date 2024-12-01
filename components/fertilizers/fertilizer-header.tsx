import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export function FertilizerHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Fertilizer Inventory
        </h1>
        <p className="text-muted-foreground">
          Manage your fertilizer inventory and track usage
        </p>
      </div>
      <Link href="/fertilizers/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Fertilizer
        </Button>
      </Link>
    </div>
  );
}
