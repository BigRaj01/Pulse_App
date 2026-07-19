"use client";

import { useState } from "react";
import { Wallet, Check, ShieldCheck, X } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { approveUsdcSpending } from "@/lib/usdc-approve";
import { ensureArcNetwork } from "@/lib/arc-network";

const DEV_WALLET_ADDRESS = process.env.NEXT_PUBLIC_DEV_WALLET_ADDRESS!;
const APPROVAL_LIMIT_USDC = 50; // authorize up to $50 total in autonomous charges

export function WalletConnect() {
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const walletApproved = useAuthStore((s) => s.walletApproved);
  const setWalletAddress = useAuthStore((s) => s.setWalletAddress);
  const setWalletApproved = useAuthStore((s) => s.setWalletApproved);
  const [connecting, setConnecting] = useState(false);
  const [approving, setApproving] = useState(false);

  async function handleConnect() {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("MetaMask not found. Please install it to connect a wallet.");
      return;
    }

    setConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      await ensureArcNetwork();

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast.success("Wallet connected");
      }
    } catch {
      toast.error("Wallet connection was cancelled or failed.");
    } finally {
      setConnecting(false);
    }
  }

  async function handleApprove() {
    if (!walletAddress) return;
    setApproving(true);
    try {
      await approveUsdcSpending(walletAddress, DEV_WALLET_ADDRESS, APPROVAL_LIMIT_USDC);
      setWalletApproved(true);
      toast.success(`Authorized up to $${APPROVAL_LIMIT_USDC} in autonomous streaming payments`);
    } catch (err) {
      console.error("Approval error:", err);
      toast.error(err instanceof Error ? err.message : "Authorization was cancelled or failed.");
    } finally {
      setApproving(false);
    }
  }

  if (walletAddress) {
    const short = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-accent/10 text-accent px-4 py-2 text-sm font-medium">
          <Check className="h-4 w-4" />
          Connected: {short}
          <button
            onClick={() => setWalletAddress(null)}
            className="ml-1 hover:text-foreground"
            title="Disconnect"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {walletApproved ? (
          <div className="flex items-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4" />
            Autonomous payments authorized
          </div>
        ) : (
          <Button onClick={handleApprove} disabled={approving} className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            {approving ? "Authorizing..." : `Authorize up to $${APPROVAL_LIMIT_USDC}`}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={connecting} className="gap-2">
      <Wallet className="h-4 w-4" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}