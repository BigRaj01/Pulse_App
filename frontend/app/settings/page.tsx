"use client";

import { Sun, Moon } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="rounded-2xl bg-card/50 p-6 flex items-center justify-between">
        <div>
          <p className="font-medium">Appearance</p>
          <p className="text-sm text-muted-foreground">
            Switch between dark and light mode.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-background/40 p-1">
          <button
            onClick={() => theme !== "dark" && toggleTheme()}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              theme === "dark"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={() => theme !== "light" && toggleTheme()}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              theme === "light"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
        </div>
      </div>
    </div>
  );
}