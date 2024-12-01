import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils/project.ts
export function getProjectStageNumber(stage: string): number {
  const stages = ["pre_design", "design", "construction", "verification"];
  return stages.indexOf(stage) + 1;
}

export function getStageColor(stage: string): string {
  switch (stage) {
    case "pre_design":
      return "bg-blue-100 text-blue-800";
    case "design":
      return "bg-purple-100 text-purple-800";
    case "construction":
      return "bg-orange-100 text-orange-800";
    case "verification":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function formatCurrency(value: number, currency: string): string {
  if (value === 0) return "0";
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
