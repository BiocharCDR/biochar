import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Crop, Scale } from "lucide-react";
import { BiomassProduction } from "@/types";

interface BiomassSummaryProps {
  data: BiomassProduction;
}

export function BiomassSummary({ data }: BiomassSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
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

      {/* Residue Generated */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                Residue Generated
              </p>
              <p className="text-2xl font-bold">
                {data.residue_generated?.toFixed(2) || "0"} t
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
                {data.residue_storage_location || "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
