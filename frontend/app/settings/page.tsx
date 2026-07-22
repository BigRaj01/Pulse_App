"use client";

import { Sun, Moon, ShieldCheck, Wallet, Bell, Info, Music } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import Link from "next/link";

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card/50 p-6 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ToggleStub({ defaultOn = false }: { defaultOn?: boolean }) {
  return (
    <div
      className={cn(
        "h-6 w-11 rounded-full p-0.5 transition-colors",
        defaultOn ? "bg-primary" : "bg-muted"
      )}
    >
      <div
        className={cn(
          "h-5 w-5 rounded-full bg-white transition-transform",
          defaultOn && "translate-x-5"
        )}
      />
    </div>
  );
}

export default function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const walletApproved = useAuthStore((s) => s.walletApproved);

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>

      <SettingsSection
        icon={theme === "dark" ? Moon : Sun}
        title="Appearance"
        description="Switch between dark and light mode."
      >
        <div className="flex items-center gap-2 rounded-full bg-background/40 p-1">
          <button
            onClick={() => theme !== "dark" && toggleTheme()}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={() => theme !== "light" && toggleTheme()}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={ShieldCheck}
        title="Autonomous Payments"
        description={
          walletAddress
            ? walletApproved
              ? "Your wallet is authorized. The agent can charge you automatically."
              : "Wallet connected but not yet authorized."
            : "No wallet connected — autonomous payments are inactive."
        }
      >
        <Link href="/wallet" className="text-sm font-medium text-primary hover:underline">
          Manage →
        </Link>
      </SettingsSection>

      <SettingsSection
        icon={Wallet}
        title="Daily Spending Budget"
        description="Your streaming agent is capped at $5.00 in autonomous charges per day."
      >
        <Link href="/activity" className="text-sm font-medium text-primary hover:underline">
          View activity →
        </Link>
      </SettingsSection>

      <SettingsSection
        icon={Music}
        title="Playback"
        description="Autoplay similar tracks when a song ends."
      >
        <ToggleStub defaultOn />
      </SettingsSection>

      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Get notified when the agent completes a payment on your behalf."
      >
        <ToggleStub defaultOn />
      </SettingsSection>

      <SettingsSection
        icon={Info}
        title="About Pulse"
        description="Version 1.0 — a demo of autonomous, agent-driven streaming payments."
      >
        <span className="text-sm text-muted-foreground">v1.0</span>
      </SettingsSection>
    </div>
  );
}