"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Layers, Calendar, AlignJustify } from "lucide-react";
import Image from "next/image";
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
import ActionList from "../icons/ActionList";
import AiCopilot from "../icons/AiCopilot";
import { UserProfile } from "@/types";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserProfile;
}

const items: NavItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Layers,
  },
  {
    title: "Action List",
    url: "/action-list",
    icon: ActionList,
  },
  {
    title: "Timeline",
    url: "/timeline",
    icon: Calendar,
  },
  {
    title: "AI Copilot",
    url: "/ai-copilot",
    icon: AiCopilot,
  },
];

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mt-5 flex-row gap-4">
        <Image
          src="/logo.png"
          width={120}
          height={40}
          alt="GreenA Logo"
          className={cn(
            "transition-opacity duration-200",
            state === "collapsed" && "hidden"
          )}
          priority
        />
        <AlignJustify
          className="size-7 rounded-sm bg-[#DCB07B] p-1 text-white max-md:hidden hover:bg-[#c49a6c] transition-colors"
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
                        isActive && "bg-white/10 text-white"
                      )}
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon />
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

      <SidebarFooter>
        {state === "expanded" && (
          <span className="text-center text-sm text-white/70">
            Powered by sustAIn
          </span>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
