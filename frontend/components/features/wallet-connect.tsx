"use client";

import { useState } from "react";
import { Wallet, Check } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function WalletConnect() {
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const setWalletAddress = useAuthStore((s) => s.setWalletAddress);
  const [connecting, setConnecting] = useState(false);

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

  if (walletAddress) {
    const short = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    return (
      <div className="flex items-center gap-2 rounded-xl bg-accent/10 text-accent px-4 py-2 text-sm font-medium">
        <Check className="h-4 w-4" />
        Connected: {short}
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