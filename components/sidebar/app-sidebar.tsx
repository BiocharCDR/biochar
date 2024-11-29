"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

import {
  AlignJustify,
  Home,
  Sprout,
  Factory,
  Warehouse,
  FileSpreadsheet,
  Settings,
  Map,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

const items: NavItem[] = [
  {
    title: "Dashboard",
    url: "/home",
    icon: Home,
  },
  {
    title: "Land Parcels",
    url: "/parcels",
    icon: Map,
  },
  {
    title: "Biomass",
    url: "/biomass",
    icon: Sprout,
  },
  {
    title: "Production",
    url: "/production",
    icon: Factory,
  },
  {
    title: "Storage",
    url: "/storage",
    icon: Warehouse,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileSpreadsheet,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mt-5 flex-row gap-4">
        <span
          className={cn(
            "font-mono uppercase text-lg font-medium",
            state === "collapsed" && "hidden"
          )}
        >
          Biochar dMRV
        </span>
        <AlignJustify
          className="size-7 rounded-sm bg-green-600 p-1 text-white max-md:hidden hover:bg-green-700 transition-colors"
          onClick={toggleSidebar}
        />
      </SidebarHeader>

      <SidebarContent className="mt-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "px-3 py-2 transition-colors",
                        isActive && "bg-green-600/20 text-green-600"
                      )}
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={cn("mr-2", isActive && "text-green-600")}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user?.email && (
        <SidebarFooter className="pb-4">
          {state === "expanded" && (
            <div className="flex flex-col items-center gap-2 px-4">
              <div className="w-full rounded-lg bg-green-600/10 p-4">
                <div className="text-sm font-medium text-green-600">
                  {user.email}
                </div>
                <div className="text-xs text-green-600/70">Farmer Account</div>
              </div>
            </div>
          )}
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
