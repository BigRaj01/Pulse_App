"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/70 backdrop-blur-xl px-4 py-3 md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search songs, artists, albums..."
          className="pl-9 bg-card/50 border-border"
        />
      </div>
      <Avatar className="h-9 w-9">
        <AvatarImage src="/placeholder/user-avatar.jpg" alt="Profile" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
}