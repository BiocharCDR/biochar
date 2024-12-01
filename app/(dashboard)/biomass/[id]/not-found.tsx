import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-3xl font-bold">Biomass Record Not Found</h1>
        <p className="text-muted-foreground text-center max-w-md">
          The biomass record you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to view it.
        </p>
        <Button asChild>
          <Link href="/biomass">Return to Biomass</Link>
        </Button>
      </div>
    </div>
  );
}
