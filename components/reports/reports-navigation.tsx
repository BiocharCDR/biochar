// app/reports/_components/reports-navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Factory,
  LineChart,
  Database,
  TrendingUp,
} from "lucide-react";

const items = [
  {
    title: "Overview",
    href: "/reports",
    icon: BarChart2,
  },
  {
    title: "Production",
    href: "/reports/production",
    icon: Factory,
  },
  {
    title: "Application",
    href: "/reports/application",
    icon: LineChart,
  },
  {
    title: "Storage",
    href: "/reports/storage",
    icon: Database,
  },
  {
    title: "Metrics",
    href: "/reports/metrics",
    icon: TrendingUp,
  },
];

export function ReportsNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 lg:space-x-4 overflow-auto pb-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
