"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { WalletConnect } from "@/components/features/wallet-connect";
import { Button } from "@/components/ui/button";

export default function ConnectWalletPage() {
  const router = useRouter();
  const walletApproved = useAuthStore((s) => s.walletApproved);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 rounded-2xl bg-card/50 p-8 text-center">
        <h1 className="text-2xl font-bold">One last step</h1>
        <p className="text-sm text-muted-foreground">
          Connect your USDC wallet and authorize autonomous streaming payments
          to start using Pulse.
        </p>

        <WalletConnect />

        <Button
          onClick={() => router.push("/")}
          disabled={!walletApproved}
          className="w-full"
        >
          {walletApproved ? "Continue to Pulse" : "Complete authorization to continue"}
        </Button>
      </div>
    </div>
  );
}