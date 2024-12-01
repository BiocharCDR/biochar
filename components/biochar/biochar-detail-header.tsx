// app/biochar/[id]/components/biochar-detail-header.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Tables } from "@/supabase/schema";

interface BiocharDetailHeaderProps {
  biochar: Tables<"biochar_production">;
}

export default function BiocharDetailHeader({
  biochar,
}: BiocharDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/biochar">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Badge
            variant={biochar.status === "completed" ? "default" : "secondary"}
          >
            {biochar.status}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Batch #{biochar.batch_number}
        </h1>
        <p className="text-sm text-muted-foreground">
          Production Date: {formatDate(biochar.production_date)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Link href={`/biochar/${biochar.id}/edit`}>
          <Button size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}
