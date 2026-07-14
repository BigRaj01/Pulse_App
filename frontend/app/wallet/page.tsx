"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { WalletCard } from "@/components/features/wallet-card";
import { TransactionList } from "@/components/features/transaction-list";

export default function WalletPage() {
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: walletLoading, isFetching } = useQuery({
    queryKey: ["wallet"],
    queryFn: walletService.getWallet,
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: walletService.getTransactions,
  });

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
  }

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>

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