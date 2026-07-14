import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Transaction } from "@/types";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="flex flex-col gap-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center gap-3 rounded-xl bg-card/50 px-4 py-3"
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full shrink-0",
              tx.type === "incoming"
                ? "bg-accent/20 text-accent"
                : "bg-primary/20 text-primary"
            )}
          >
            {tx.type === "incoming" ? (
              <ArrowDownLeft className="h-4 w-4" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{tx.counterparty}</p>
            <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
          </div>
          <div className="text-right shrink-0">
            <p
              className={cn(
                "text-sm font-medium",
                tx.type === "incoming" ? "text-accent" : "text-foreground"
              )}
            >
              {tx.type === "incoming" ? "+" : "-"}${tx.amount.toFixed(2)}
            </p>
            <p
              className={cn(
                "text-xs",
                tx.status === "pending" ? "text-yellow-500" : "text-muted-foreground"
              )}
            >
              {tx.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}