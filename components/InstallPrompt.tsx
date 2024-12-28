"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InstallPromptProps {
  open: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export default function InstallPrompt({
  open,
  onClose,
  onInstall,
}: InstallPromptProps) {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
  }, []);

  const handleClose = () => {
    // Save to localStorage that user has seen the prompt
    localStorage.setItem("installPromptDismissed", "true");
    onClose();
  };

  const handleInstall = () => {
    onInstall();
    // Save to localStorage on installation attempt
    localStorage.setItem("installPromptDismissed", "true");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg animate-in slide-in-from-bottom duration-300 p-0 gap-0 bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800">
        <DialogHeader className="p-6 pb-0">
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-800/50"
              onClick={handleClose}
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <ArrowDownToLine className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white text-center">
              Install BIOCHAR App
            </DialogTitle>
            <p className="text-center text-gray-400 text-sm max-w-sm">
              Get quick access to BIOCHAR with our mobile app. Track your
              production anywhere, anytime.
            </p>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {isIOS ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <Share2 className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-200">
                    To install BIOCHAR on your iOS device:
                  </p>
                  <ol className="text-sm text-gray-400 space-y-1 list-decimal pl-4">
                    <li>Tap the share button in your browser</li>
                    <li>Scroll and select &quot;Add to Home Screen&quot;</li>
                    <li>Tap &quot;Add&quot; to install</li>
                  </ol>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full hover:bg-gray-800"
                onClick={handleClose}
              >
                Maybe Later
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <ArrowDownToLine className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-200">
                    Benefits of installing BIOCHAR:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Faster access to your dashboard</li>
                    <li>• Works offline</li>
                    <li>• Real-time production tracking</li>
                    <li>• Native app-like experience</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  onClick={handleInstall}
                >
                  Install App
                </Button>
                <Button
                  variant="ghost"
                  className="w-full hover:bg-gray-800"
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
