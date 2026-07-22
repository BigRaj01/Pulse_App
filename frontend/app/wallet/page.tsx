"use client";

import { WalletConnect } from "@/components/features/wallet-connect";
import { useState, useEffect } from "react";
import { getUsdcBalance } from "@/lib/usdc-balance";
import { useAuthStore } from "@/store/auth-store";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function WalletPage() {
  const connectedWalletAddress = useAuthStore((s) => s.walletAddress);
  const [connectedBalance, setConnectedBalance] = useState<number | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    if (!connectedWalletAddress) {
      setConnectedBalance(null);
      return;
    }

    let cancelled = false;

    async function fetchBalance(address: string) {
      try {
        const balance = await getUsdcBalance(address);
        if (!cancelled) setConnectedBalance(balance);
      } catch (err) {
        console.error("Failed to fetch connected wallet balance:", err);
      }
    }

    fetchBalance(connectedWalletAddress);
    const interval = setInterval(() => fetchBalance(connectedWalletAddress), 20000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connectedWalletAddress]);

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Wallet</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Connect your own USDC wallet to enable autonomous streaming payments.
      </p>
      <div className="mb-6">
        <WalletConnect />
      </div>

      {connectedWalletAddress && (
        <div className="rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Your Connected Wallet Balance
            </p>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-muted-foreground hover:text-foreground"
            >
              {balanceVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-3xl font-bold">
            {!balanceVisible
              ? "••••••"
              : connectedBalance !== null
              ? `$${connectedBalance.toFixed(4)}`
              : "Loading..."}
            {balanceVisible && (
              <span className="text-sm text-muted-foreground ml-2">USDC</span>
            )}
          </p>
        </div>
      )}

      {connectedWalletAddress && (
        <div className="rounded-2xl bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            See every autonomous charge and why the agent made each decision.
          </p>
          <Link href="/activity" className="text-primary font-medium hover:underline">
            View Agent Activity Log →
          </Link>
        </div>
      )}
    </div>
  );
}