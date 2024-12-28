"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ArrowDownToLine, Share2 } from "lucide-react";

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
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight">BIOCHAR MRV</h1>
          </div>
          <DialogTitle className="text-xl text-center">
            Install BIOCHAR App
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Get quick access to BIOCHAR right from your home screen
          </p>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {isIOS ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Share2 className="w-6 h-6 text-muted-foreground shrink-0" />
                <p className="text-sm">
                  Tap the share button, then choose &quot;Add to Home
                  Screen&quot;
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClose}
              >
                Maybe Later
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <ArrowDownToLine className="w-6 h-6 text-muted-foreground shrink-0" />
                <p className="text-sm">
                  Install BIOCHAR for a better experience with offline support
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleClose}>
                  Install App
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleClose}
                >
                  Not Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
