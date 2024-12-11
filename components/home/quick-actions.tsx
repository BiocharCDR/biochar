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
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        ? "First step: Register your land parcels"
        : "Add or manage your land parcels",
      icon: Map,
      href: "/parcels/new",
      variant: showGuide ? "default" : "ghost",
      highlight: showGuide,
    },
    {
      title: "Record Biomass",
      description: "Record your biomass production",
      icon: Leaf,
      href: "/biomass/new",
      variant: "ghost" as const,
      disabled: showGuide,
      tooltipText: showGuide ? "Complete land registration first" : undefined,
    },
    {
      title: "Start Production",
      description: "Begin biochar production process",
      icon: Factory,
      href: "/biochar/new",
      variant: "ghost" as const,
      disabled: !hasBiomassRecords,
      tooltipText: !hasBiomassRecords
        ? "Record biomass production first"
        : undefined,
    },
    {
      title: "View Reports",
      description: "Check production analytics",
      icon: FileText,
      href: "/reports",
      variant: "ghost" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Quick Actions
          {showGuide && (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                Complete the getting started steps
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => {
          const ActionButton = (
            <Button
              key={action.title}
              variant="ghost"
              className={`group w-full justify-start space-x-4 ${
                action.disabled ? "opacity-50" : ""
              } ${action.highlight ? "bg-primary/10 hover:bg-primary/20" : ""}`}
              onClick={() => router.push(action.href)}
              disabled={action.disabled}
            >
              <div
                className={`
                rounded-full p-1.5
                ${action.highlight ? "bg-primary" : "bg-muted"}
              `}
              >
                <action.icon
                  className={`
                  h-4 w-4
                  ${
                    action.highlight
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }
                `}
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <div className="text-sm font-medium leading-none">
                    {action.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Button>
          );

          return action.tooltipText ? (
            <Tooltip key={action.title}>
              <TooltipTrigger asChild>{ActionButton}</TooltipTrigger>
              <TooltipContent>{action.tooltipText}</TooltipContent>
            </Tooltip>
          ) : (
            ActionButton
          );
        })}
      </CardContent>
    </Card>
  );
}
