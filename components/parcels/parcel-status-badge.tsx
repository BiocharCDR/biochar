import { Badge } from "@/components/ui/badge";

interface ParcelStatusBadgeProps {
  status: string;
}

export function ParcelStatusBadge({ status }: ParcelStatusBadgeProps) {
  return (
    <Badge
      variant={status === "active" ? "default" : "secondary"}
      className="capitalize"
    >
      {status}
    </Badge>
  );
}
