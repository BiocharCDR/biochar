"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Menu,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminUserButton } from "./admin-user-button";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Farmers",
    icon: Users,
    href: "/admin/farmers",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="px-3 py-2 border-b">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin Dashboard</h2>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 p-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href
                  ? "text-primary bg-primary/10"
                  : "text-zinc-600"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <AdminUserButton />
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed left-4 top-4 z-40"
            size="icon"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50">
        <div className="h-full bg-white border-r">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
