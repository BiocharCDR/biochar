"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/supabase/schema";
import { BiocharProduction } from "@/types";
import { Factory, LayoutGrid, Scale, TreeDeciduous, Users } from "lucide-react";
import React from "react";

interface MonthlyMetric {
  month: string;
  total_biochar_produced: number;
  total_biomass_produced: number;
}

interface AdminDashboardProps {
  totalFarmers: number;
  totalParcels: number;
  totalBiocharProduced: number;
  averageYield: number;
  recentProduction: BiocharProduction[];
}

const AdminDashboard = ({
  averageYield,
  recentProduction,
  totalBiocharProduced,
  totalFarmers,
  totalParcels,
}: AdminDashboardProps) => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of biochar production system
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFarmers}</div>
            <p className="text-xs text-muted-foreground">Registered farmers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Land Parcels</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParcels}</div>
            <p className="text-xs text-muted-foreground">Registered parcels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biochar</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBiocharProduced}kg</div>
            <p className="text-xs text-muted-foreground">Total production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageYield}%</div>
            <p className="text-xs text-muted-foreground">Biochar yield rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Production Stats */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Production</CardTitle>
            <CardDescription>Latest biochar production batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentProduction?.length > 0 ? (
                recentProduction.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <TreeDeciduous className="h-9 w-9 text-blue-500" />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium">
                        Batch #{item.batch_number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.biochar_weight}kg biochar produced from{" "}
                        {item.biomass_weight}kg biomass
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {item.yield_percentage}% yield
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No recent production data
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
