"use client";

import { useQuery } from "@tanstack/react-query";
import { LogOut, Settings } from "lucide-react";
import { userService } from "@/services/user.service";
import Link from "next/link";
import { SongCard } from "@/components/features/song-card";
import { SongCardSkeleton } from "@/components/features/song-card-skeleton";
import { CoverImage } from "@/components/features/cover-image";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: userService.getCurrentUser,
  });

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden bg-secondary">
          {user && (
            <CoverImage
              src={user.avatarUrl}
              alt={user.username}
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">
            {isLoading ? "Loading..." : user?.username}
          </h1>
          <p className="text-sm text-muted-foreground">Pulse member</p>
        </div>
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Uploaded Songs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <SongCardSkeleton key={i} />)
            : user?.uploadedSongs.length
            ? user.uploadedSongs.map((song) => (
                <SongCard key={song.id} song={song} queue={user.uploadedSongs} />
              ))
            : (
                <p className="text-sm text-muted-foreground col-span-full">
                  You haven&apos;t uploaded any songs yet.
                </p>
              )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Favorites</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <SongCardSkeleton key={i} />)
            : user?.favorites.length
            ? user.favorites.map((song) => (
                <SongCard key={song.id} song={song} queue={user.favorites} />
              ))
            : (
                <p className="text-sm text-muted-foreground col-span-full">
                  No favorites yet.
                </p>
              )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SongCardSkeleton key={i} />)
            : user?.history.length
            ? user.history.map((song, i) => (
                <SongCard key={`${song.id}-${i}`} song={song} queue={user.history} />
              ))
            : (
                <p className="text-sm text-muted-foreground col-span-full">
                  No listening history yet.
                </p>
              )}
        </div>
      </section>
    </div>
  );
}