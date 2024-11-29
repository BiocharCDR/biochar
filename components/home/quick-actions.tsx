"use client";
// app/(main)/home/components/quick-actions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  FileText,
  BarChart2,
  Map,
  Factory,
  Leaf,
} from "lucide-react";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "Start Production",
      description: "Begin new biochar production",
      icon: Factory,
      href: "/production/new",
      variant: "default" as const,
    },
    {
      title: "Add Biomass",
      description: "Record new biomass",
      icon: Leaf,
      href: "/biomass/new",
      variant: "secondary" as const,
    },
    {
      title: "View Reports",
      description: "Check production reports",
      icon: FileText,
      href: "/reports",
      variant: "secondary" as const,
    },
    {
      title: "Add Land Parcel",
      description: "Register new land parcel",
      icon: Map,
      href: "/parcels/new",
      variant: "secondary" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="w-full justify-start"
            onClick={() => router.push(action.href)}
          >
            <action.icon className="mr-2 h-4 w-4" />
            <div className="flex flex-col items-start">
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
