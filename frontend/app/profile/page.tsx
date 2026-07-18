"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Settings, Pencil, Check } from "lucide-react";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { SongCard } from "@/components/features/song-card";
import { SongCardSkeleton } from "@/components/features/song-card-skeleton";
import { CoverImage } from "@/components/features/cover-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { data: activity, isLoading } = useQuery({
    queryKey: ["current-user-activity"],
    queryFn: userService.getCurrentUser,
  });

  const { name, email, avatarUrl, logout, updateProfile } = useAuthStore();
  const router = typeof window !== "undefined" ? undefined : undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(name);

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function saveName() {
    updateProfile({ name: nameDraft.trim() || name });
    setIsEditingName(false);
  }

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleAvatarClick}
          className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden bg-secondary group"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <CoverImage src="" alt={name || "U"} className="object-cover" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-4 w-4 text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="h-8 max-w-xs"
                autoFocus
              />
              <button onClick={saveName}>
                <Check className="h-4 w-4 text-accent" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold truncate">{name || "Unnamed"}</h1>
              <button
                onClick={() => {
                  setNameDraft(name);
                  setIsEditingName(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Uploaded Songs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <SongCardSkeleton key={i} />)
            : activity?.uploadedSongs.length
            ? activity.uploadedSongs.map((song) => (
                <SongCard key={song.id} song={song} queue={activity.uploadedSongs} />
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
            : activity?.favorites.length
            ? activity.favorites.map((song) => (
                <SongCard key={song.id} song={song} queue={activity.favorites} />
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
            : activity?.history.length
            ? activity.history.map((song, i) => (
                <SongCard key={`${song.id}-${i}`} song={song} queue={activity.history} />
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