"use client";

import { Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/70 backdrop-blur-xl px-4 py-3 md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search songs, artists, albums..."
          className="pl-9 bg-card/50 border-border"
        />
      </div>
      {email && (
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}