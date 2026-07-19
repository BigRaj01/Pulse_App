"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { WalletCard } from "@/components/features/wallet-card";
import { TransactionList } from "@/components/features/transaction-list";
import { WalletConnect } from "@/components/features/wallet-connect";
import { useState, useEffect } from "react";
import { getUsdcBalance } from "@/lib/usdc-balance";
import { useAuthStore } from "@/store/auth-store";

export default function WalletPage() {
  const queryClient = useQueryClient();
  const connectedWalletAddress = useAuthStore((s) => s.walletAddress);
  const [connectedBalance, setConnectedBalance] = useState<number | null>(null);

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
    const interval = setInterval(() => fetchBalance(connectedWalletAddress), 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connectedWalletAddress]);

  const { data: wallet, isLoading: walletLoading, isFetching } = useQuery({
    queryKey: ["wallet"],
    queryFn: walletService.getWallet,
    refetchInterval: 8000,
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: walletService.getTransactions,
    refetchInterval: 8000,
  });

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
  }

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
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Your Connected Wallet Balance
          </p>
          <p className="text-3xl font-bold">
            {connectedBalance !== null ? `$${connectedBalance.toFixed(4)}` : "Loading..."}
            <span className="text-sm text-muted-foreground ml-2">USDC</span>
          </p>
        </div>
      )}

      {walletLoading || !wallet ? (
        <div className="h-48 rounded-2xl bg-card/50 animate-pulse" />
      ) : (
        <WalletCard wallet={wallet} onRefresh={handleRefresh} isRefreshing={isFetching} />
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Recent Transactions</h2>

      {txLoading || !transactions ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
}