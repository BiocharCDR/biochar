"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className=" px-2 py-1">
      <Label htmlFor="theme-switch" className="sr-only">
        Toggle theme
      </Label>
      <div
        className="group inline-flex items-center gap-2"
        data-state={theme === "dark" ? "checked" : "unchecked"}
      >
        <span
          className="flex-1 cursor-pointer text-right text-sm font-medium transition-colors group-data-[state=checked]:text-primary group-data-[state=unchecked]:text-muted-foreground/70"
          onClick={() => setTheme("dark")}
        >
          <Moon
            size={14}
            strokeWidth={2}
            aria-hidden="true"
            className="inline-block transition-transform group-data-[state=checked]:scale-110"
          />
        </span>
        <Switch
          id="theme-switch"
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle between dark and light mode"
        />
        <span
          className="flex-1 cursor-pointer text-left text-sm font-medium transition-colors group-data-[state=unchecked]:text-primary group-data-[state=checked]:text-muted-foreground/70"
          onClick={() => setTheme("light")}
        >
          <Sun
            size={14}
            strokeWidth={2}
            aria-hidden="true"
            className="inline-block transition-transform group-data-[state=unchecked]:scale-110"
          />
        </span>
      </div>
    </div>
  );
}
