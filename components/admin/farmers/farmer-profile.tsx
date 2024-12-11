import { format } from "date-fns";
import {
  User,
  Phone,
  MapPin,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FarmerProfileProps {
  farmer: {
    id: string | null;
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    address: string | null;
    created_at: string;
    avatar_url: string | null;
    land_ownership_status: boolean | null;
    carbon_rights_agreement: boolean | null;
    num_of_cattle: number | null;
    status: string | null;
    land_parcels: { id: string }[] | null;
  };
}

export function FarmerProfile({ farmer }: FarmerProfileProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={farmer.avatar_url || ""}
              alt={farmer.full_name || "Farmer"}
            />
            <AvatarFallback>
              {farmer
                ?.full_name!.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{farmer.full_name}</h1>
              <Badge
                variant={farmer.status === "active" ? "default" : "secondary"}
              >
                {farmer.status || "N/A"}
              </Badge>
            </div>

            <div className="grid gap-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{farmer.email || "No email provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{farmer.phone_number || "No phone number provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{farmer.address || "No address provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Joined {format(new Date(farmer.created_at), "PPP")}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-2 md:w-[200px] md:justify-self-end">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Land Owner</span>
              {farmer.land_ownership_status ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Carbon Rights
              </span>
              {farmer.carbon_rights_agreement ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cattle</span>
              <span className="text-sm font-medium">
                {farmer.num_of_cattle || "0"} animals
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Land Parcels
              </span>
              <span className="text-sm font-medium">
                {farmer.land_parcels?.length || "0"} parcels
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
