"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, RefreshCw, Check } from "lucide-react";
import { Wallet } from "@/types";
import { cn } from "@/lib/utils";

export function WalletCard({
  wallet,
  onRefresh,
  isRefreshing,
}: {
  wallet: Wallet;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-muted-foreground">
          {wallet.isDeveloperControlled ? "Developer Controlled Wallet" : "Wallet"}
        </span>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </button>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-4xl font-bold">
          {balanceVisible ? `$${wallet.usdcBalance.toFixed(2)}` : "••••••"}
        </span>
        <span className="text-sm text-muted-foreground mb-1">USDC</span>
        <button
          onClick={() => setBalanceVisible(!balanceVisible)}
          className="ml-auto text-muted-foreground hover:text-foreground mb-1"
        >
          {balanceVisible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-background/40 px-3 py-2">
        <span className="text-sm font-mono flex-1 truncate">{shortAddress}</span>
        <button onClick={handleCopy} className="shrink-0">
          {copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}