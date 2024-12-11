// app/storage/[id]/components/storage-detail-header.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Pencil } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { StorageDetailHeaderProps } from "./types";

export default function StorageDetailHeader({
  storage,
}: StorageDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/storage">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Badge
            variant={
              storage.status === "available"
                ? "default"
                : storage.status === "in_use"
                ? "secondary"
                : "destructive"
            }
          >
            {storage.status}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Storage Record: {storage.biochar.batch_number}
        </h1>
        <p className="text-sm text-muted-foreground">
          Stored on {formatDate(storage.storage_date)} • Location:{" "}
          {storage.storage_location}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Link href={`/storage/${storage.id}/apply`}>
          <Button variant="secondary" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Application
          </Button>
        </Link>
        <Link href={`/storage/${storage.id}/edit`}>
          <Button size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}
