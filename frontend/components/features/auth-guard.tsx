"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const PUBLIC_ROUTES = ["/login", "/signup"];
const WALLET_SETUP_ROUTE = "/connect-wallet";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const walletApproved = useAuthStore((s) => s.walletApproved);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login");
      return;
    }

    if (
      isAuthenticated &&
      !walletApproved &&
      pathname !== WALLET_SETUP_ROUTE &&
      !PUBLIC_ROUTES.includes(pathname)
    ) {
      router.push(WALLET_SETUP_ROUTE);
    }
  }, [hydrated, isAuthenticated, walletApproved, pathname, router]);

  if (!hydrated) return null;

  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  if (
    isAuthenticated &&
    !walletApproved &&
    pathname !== WALLET_SETUP_ROUTE &&
    !PUBLIC_ROUTES.includes(pathname)
  ) {
    return null;
  }

  return <>{children}</>;
}