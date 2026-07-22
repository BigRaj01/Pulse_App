"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { agentActivityService } from "@/services/agent.service";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ActivityLogPage() {
  const walletAddress = useAuthStore((s) => s.walletAddress);

  const { data: log, isLoading } = useQuery({
    queryKey: ["agent-activity-log", walletAddress],
    queryFn: () => agentActivityService.getLog(walletAddress!),
    enabled: !!walletAddress,
    refetchInterval: 15000,
    retry: false,
  });

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Agent Activity Log</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Every decision the autonomous agent made about your streams, in real time.
      </p>

      {!walletAddress ? (
        <p className="text-sm text-muted-foreground">Connect your wallet to see your activity.</p>
      ) : isLoading || !log ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : log.length === 0 ? (
        <p className="text-sm text-muted-foreground">No agent decisions yet — play a song to see one appear here.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {log.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-xl bg-card/50 px-4 py-3"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5",
                  entry.shouldPay ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                )}
              >
                {entry.shouldPay ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {entry.shouldPay ? `Charged $${entry.amount}` : "No charge"}
                </p>
                <p className="text-xs text-muted-foreground">{entry.reason}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatTime(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}