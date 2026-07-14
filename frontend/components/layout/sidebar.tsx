"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Upload, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0 px-4 py-6">
      <div className="mb-8 px-2">
        <span className="text-xl font-bold tracking-tight">Pulse</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}