"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const hasUserDismissed = localStorage.getItem("installPromptDismissed");
    if (!hasUserDismissed) {
      setOpen(true);
    }

    // Check if it's iOS device
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
    // Check if app is already installed
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("installPromptDismissed", "true");
  };

  if (isStandalone) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md animate-in slide-in-from-top duration-300">
        <DialogHeader>
          <DialogTitle>Install App</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isIOS ? (
            <p className="text-sm text-muted-foreground">
              To install this app on your iOS device, tap the share button
              <span role="img" aria-label="share icon" className="mx-1">
                ⎋
              </span>
              and then "Add to Home Screen"
              <span role="img" aria-label="plus icon" className="mx-1">
                ➕
              </span>
            </p>
          ) : (
            <Button className="w-full" onClick={handleClose}>
              Add to Home Screen
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
