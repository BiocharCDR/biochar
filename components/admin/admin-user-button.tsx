"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AdminUserButtonProps {
  className?: string;
}

export function AdminUserButton({ className }: AdminUserButtonProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/signin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal",
            className
          )}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Admin Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
