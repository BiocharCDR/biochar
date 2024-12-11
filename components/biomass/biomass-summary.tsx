import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Crop, Scale } from "lucide-react";
import { BiomassProduction } from "@/types";

interface BiomassSummaryProps {
  data: BiomassProduction;
}

export function BiomassSummary({ data }: BiomassSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Yield */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Crop className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Total Yield</p>
                <p className="text-2xl font-bold">
                  {data.crop_yield?.toFixed(2) || "0"} t
                </p>
              </div>
            </div>
            <Badge variant={data.status === "stored" ? "default" : "secondary"}>
              {data.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Biomass Remaining */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                Biomass Remaining
              </p>
              <p className="text-2xl font-bold">
                {data.biomass_remaining?.toFixed(2) || "0"} t
              </p>
              <p className="text-sm text-muted-foreground">
                Used: {data.biomass_used?.toFixed(2) || "0"} t
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residue Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                Residue Remaining
              </p>
              <p className="text-2xl font-bold">
                {data.residue_remaining?.toFixed(2) || "0"} t
              </p>
              <p className="text-sm text-muted-foreground">
                Used: {data.residue_used?.toFixed(2) || "0"} t
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Location */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Warehouse className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                Storage Location
              </p>
              <p className="text-2xl font-bold">
                {data.biomass_storage_location || "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
