"use client";

import { Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FarmerProgressGuideProps {
  profile: any;
  hasLandParcels: boolean;
  hasBiomassRecords: boolean;
  hasBiocharProduction: boolean;
  hasFertilizerRecords: boolean;
}

export default function FarmerProgressGuide({
  profile,
  hasLandParcels,
  hasBiomassRecords,
  hasBiocharProduction,
  hasFertilizerRecords,
}: FarmerProgressGuideProps) {
  const router = useRouter();

  const steps = [
    {
      title: "Land Registration",
      description: "Register your land parcels",
      completed: hasLandParcels,
      href: "/parcels/new",
      icon: hasLandParcels ? Check : AlertCircle,
    },
    {
      title: "Biomass Recording",
      description: "Record your biomass production",
      completed: hasBiomassRecords,
      href: "/biomass/new",
      disabled: !hasLandParcels,
      icon: hasBiomassRecords ? Check : AlertCircle,
    },
    {
      title: "Biochar Production",
      description: "Start biochar production",
      completed: hasBiocharProduction,
      href: "/biochar/new",
      disabled: !hasBiomassRecords,
      icon: hasBiocharProduction ? Check : AlertCircle,
    },
    {
      title: "Fertilizer Management",
      description: "Record fertilizer inventory",
      completed: hasFertilizerRecords,
      href: "/fertilisers/new",
      disabled: !hasBiocharProduction,
      icon: hasFertilizerRecords ? Check : AlertCircle,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Getting Started
          <span className="text-sm font-normal text-muted-foreground">
            Complete these steps
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative flex items-center space-x-4 ${
                step.disabled ? "opacity-50" : ""
              }`}
            >
              {index !== steps.length - 1 && (
                <div className="absolute left-3.5 top-8 h-full w-px bg-border" />
              )}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  step.completed
                    ? "bg-primary text-primary-foreground"
                    : "border border-border"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <Button
                  variant={step.completed ? "secondary" : "default"}
                  size="sm"
                  onClick={() => router.push(step.href)}
                  disabled={step.disabled}
                >
                  {step.completed ? "View" : "Start"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
