"use client";

import { Play } from "lucide-react";
import { Song } from "@/types";
import { usePlayerStore } from "@/store/player-store";
import { cn } from "@/lib/utils";
import { CoverImage } from "@/components/features/cover-image";

export function SongCard({ song, queue }: { song: Song; queue?: Song[] }) {
  const { currentSong, playSong } = usePlayerStore();
  const isActive = currentSong?.id === song.id;

  return (
    <button
      onClick={() => playSong(song, queue)}
      className="group relative flex flex-col gap-2 rounded-2xl bg-card/50 p-3 text-left transition-colors hover:bg-card"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary">
        <CoverImage src={song.coverUrl} alt={song.title} className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="h-4 w-4 ml-0.5" />
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-sm font-medium",
            isActive && "text-primary"
          )}
        >
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </button>
  );
}