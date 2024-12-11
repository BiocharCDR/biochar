import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function StorageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Storage Management
        </h1>
        <p className="text-muted-foreground">
          Manage your biochar storage and track applications
        </p>
      </div>
      <Link href="/storage/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Storage
        </Button>
      </Link>
    </div>
  );
}
