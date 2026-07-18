import { Wallet, Transaction, TransactionType, TransactionStatus } from "@/types";
import { apiClient } from "@/lib/api-client";

interface CircleWalletDetails {
  wallet: {
    address: string;
  };
}

interface CircleTokenBalance {
  token: { id: string; symbol: string; isNative: boolean };
  amount: string;
}

interface CircleBalanceResponse {
  tokenBalances: CircleTokenBalance[];
}

interface CircleTransaction {
  id: string;
  transactionType: "INBOUND" | "OUTBOUND";
  state: string;
  operation?: string;
  destinationAddress?: string;
  sourceAddress?: string;
  contractAddress?: string;
  amounts: string[];
  createDate: string;
}

interface CircleTransactionsResponse {
  transactions: CircleTransaction[];
}

function mapTransactionType(type: string): TransactionType {
  return type === "INBOUND" ? "incoming" : "outgoing";
}

function mapTransactionStatus(state: string): TransactionStatus {
  if (state === "COMPLETE") return "completed";
  if (state === "FAILED") return "failed";
  return "pending";
}

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    const [detailsRes, balanceRes] = await Promise.all([
      apiClient.get<CircleWalletDetails>("/wallet/details"),
      apiClient.get<CircleBalanceResponse>("/wallet/balance"),
    ]);

    // Prefer the non-native ERC20 USDC balance, since that's the transferable token.
    const usdcBalance = balanceRes.data.tokenBalances.find(
      (b) => b.token.symbol === "USDC" && !b.token.isNative
    );

    return {
      address: detailsRes.data.wallet.address,
      usdcBalance: usdcBalance ? parseFloat(usdcBalance.amount) : 0,
      isDeveloperControlled: true,
    };
  },

  refreshBalance: async (): Promise<number> => {
    const res = await apiClient.get<CircleBalanceResponse>("/wallet/balance");
    const usdcBalance = res.data.tokenBalances.find(
      (b) => b.token.symbol === "USDC" && !b.token.isNative
    );
    return usdcBalance ? parseFloat(usdcBalance.amount) : 0;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const res = await apiClient.get<CircleTransactionsResponse>("/wallet/transactions");
    return res.data.transactions.map((tx) => {
      const isContractCall = tx.operation === "CONTRACT_EXECUTION";
      return {
        id: tx.id,
        type: mapTransactionType(tx.transactionType),
        amount: tx.amounts.length > 0 ? parseFloat(tx.amounts[0]) : 0,
        status: mapTransactionStatus(tx.state),
        counterparty: isContractCall
          ? "On-chain settlement log"
          : tx.transactionType === "INBOUND"
          ? tx.sourceAddress ?? "Unknown"
          : tx.destinationAddress ?? "Unknown",
        timestamp: tx.createDate,
      };
    });
  },
};