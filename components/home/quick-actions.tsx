"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  FileText,
  Map,
  Factory,
  Leaf,
  AlertTriangle,
} from "lucide-react";

interface QuickActionsProps {
  showGuide: boolean;
  hasBiomassRecords: boolean;
}

export default function QuickActions({
  showGuide,
  hasBiomassRecords,
}: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      title: "Register Land",
      description: showGuide
        ? "First step: Register your land"
        : "Add new land parcel",
      icon: Map,
      href: "/parcels/new",
      variant: showGuide ? "default" : "secondary",
    },
    {
      title: "Record Biomass",
      description: "Record biomass production",
      icon: Leaf,
      href: "/biomass/new",
      variant: "secondary",
      disabled: showGuide,
    },
    {
      title: "Start Production",
      description: "Begin biochar production",
      icon: Factory,
      href: "/biochar/new",
      variant: "secondary",
      disabled: !hasBiomassRecords,
    },
    {
      title: "View Reports",
      description: "Check production analytics",
      icon: FileText,
      href: "/reports",
      variant: "secondary",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Quick Actions
          {showGuide && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="w-full justify-start h-auto py-3"
            onClick={() => router.push(action.href)}
          >
            <action.icon className="mr-2 h-4 w-4" />
            <div className="flex flex-col items-start text-left">
              <span>{action.title}</span>
              <span className="text-xs text-muted-foreground">
                {action.description}
              </span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
