"use client";

import React from "react";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { AlignJustify } from "lucide-react";
import { UserProfile } from "@/types";
import { Button } from "../ui/button";
import NotificationIcon from "../icons/NotificationIcon";

interface SidebarHeaderProps {
  user: UserProfile;
}

const SidebarHeader = ({ user }: SidebarHeaderProps) => {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <div className="flex h-16 w-full shrink-0 items-center justify-between gap-3 px-4 md:justify-end">
      <AlignJustify
        className=" rounded-sm bg-[#DCB07B] p-1 text-white size-7 md:hidden"
        onClick={() => setOpenMobile(!openMobile)}
      />
      <div className=" flex gap-3">
        <NotificationIcon />
        <NavUser user={user} />
      </div>
    </div>
  );
};

export default SidebarHeader;
