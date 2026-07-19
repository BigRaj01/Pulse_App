"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const PUBLIC_ROUTES = ["/login", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Zustand's persist middleware loads saved state asynchronously;
    // wait one tick so we don't redirect before it's had a chance to load.
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated) return null;
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}