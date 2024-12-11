// app/fertilisers/[id]/components/fertilizer-detail-header.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Tables } from "@/supabase/schema";

interface FertilizerDetailHeaderProps {
  fertilizer: Tables<"fertilizer_inventory">;
}

export default function FertilizerDetailHeader({
  fertilizer,
}: FertilizerDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/fertilizers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Badge
            variant={
              fertilizer.status === "in_stock"
                ? "default"
                : fertilizer.status === "low_stock"
                ? "warning"
                : "destructive"
            }
          >
            {fertilizer.status === "in_stock"
              ? "In Stock"
              : fertilizer.status === "low_stock"
              ? "Low Stock"
              : "Out of Stock"}
          </Badge>
          <Badge variant="secondary">{fertilizer.fertilizer_type}</Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{fertilizer.name}</h1>
        <p className="text-sm text-muted-foreground">
          Added on {formatDate(fertilizer.created_at)}
          {fertilizer.batch_number && ` • Batch: ${fertilizer.batch_number}`}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Link href={`/fertilizers/${fertilizer.id}/usage`}>
          <Button variant="secondary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Record Usage
          </Button>
        </Link>
        <Link href={`/fertilizers/${fertilizer.id}/edit`}>
          <Button size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}
