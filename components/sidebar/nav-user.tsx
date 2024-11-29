"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  ChevronDown,
  CircleUserRound,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  // Get user details from user_metadata
  const name =
    user.user_metadata?.name || user.user_metadata?.full_name || "User";
  const email = user.email;
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    `https://avatar.vercel.sh/${email}`;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh(); // Refresh to clear any cached data
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent">
            <Avatar className="size-11">
              <AvatarImage
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="bg-teal-500 text-white">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col md:items-start md:mr-2 max-md:hidden">
              <p className="text-sm font-medium capitalize">{name}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Farmer Account</span>
              </div>
            </div>
            <ChevronDown className="size-4 ml-2 rounded-full bg-brand-primary/40 text-brand-primary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none capitalize">
                {name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="flex gap-1 items-center  w-full">
              <CircleUserRound className="mr-2 size-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex gap-1 items-center w-full">
              <Settings className="mr-2 size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/billing" className="flex gap-1 items-center w-full">
              <CreditCard className="mr-2 size-4" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ThemeSwitcher />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="group cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <LogOut className="mr-2 size-4 group-hover:text-red-600" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
