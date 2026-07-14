"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
} from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useAppStore } from "@/store/app-store";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CoverImage } from "@/components/features/cover-image";
import { synthEngine } from "@/lib/synth-engine";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    shuffle,
    repeat,
    togglePlay,
    setProgress,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    playNext,
    playPrevious,
  } = usePlayerStore();

  const { isFavorite, addFavorite, removeFavorite } = useAppStore();

  if (!currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 border-t border-border bg-card/80 backdrop-blur-xl px-4 py-3">
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 min-w-0 w-48">
          <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-secondary">
            <CoverImage
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{currentSong.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {currentSong.artist}
            </p>
          </div>
          <button
            onClick={() =>
              favorited ? removeFavorite(currentSong.id) : addFavorite(currentSong)
            }
            className="shrink-0"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                favorited ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1 max-w-xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={toggleShuffle}>
              <Shuffle
                className={cn(
                  "h-4 w-4",
                  shuffle ? "text-primary" : "text-muted-foreground"
                )}
              />
            </button>
            <button onClick={playPrevious} className="text-foreground">
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </button>
            <button onClick={playNext} className="text-foreground">
              <SkipForward className="h-5 w-5" />
            </button>
            <button onClick={cycleRepeat}>
              <RepeatIcon
                className={cn(
                  "h-4 w-4",
                  repeat !== "off" ? "text-primary" : "text-muted-foreground"
                )}
              />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground w-8 text-right">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={currentSong.duration}
              step={1}
              onValueChange={(val) => {
                const seconds = Array.isArray(val) ? val[0] : val;
                setProgress(seconds);
                synthEngine.seek(seconds);
              }}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">
              {formatTime(currentSong.duration)}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 w-32">
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(val) =>
              setVolume((Array.isArray(val) ? val[0] : val) / 100)
            }
          />
        </div>
      </div>
    </div>
  );
}