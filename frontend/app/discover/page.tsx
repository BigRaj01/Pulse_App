"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { musicService } from "@/services/music.service";
import { GENRES } from "@/constants/mock-data";
import { SongCard } from "@/components/features/song-card";
import { SongCardSkeleton } from "@/components/features/song-card-skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const { data: allSongs, isLoading } = useQuery({
    queryKey: ["all-songs"],
    queryFn: musicService.getAllSongs,
  });

  const filteredSongs = allSongs?.filter((song) => {
    const matchesQuery =
      query.trim() === "" ||
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = !activeGenre || song.genre === activeGenre;
    return matchesQuery && matchesGenre;
  });

  return (
    <div className="pb-24 px-4 md:px-6 pt-8">
      <h1 className="text-3xl font-bold mb-6">Discover</h1>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs or artists..."
          className="pl-9 bg-card/50 border-border"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveGenre(null)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            !activeGenre
              ? "bg-primary text-primary-foreground"
              : "bg-card/50 text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeGenre === genre
                ? "bg-primary text-primary-foreground"
                : "bg-card/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <SongCardSkeleton key={i} />)
          : filteredSongs?.map((song) => (
              <SongCard key={song.id} song={song} queue={filteredSongs} />
            ))}
      </div>

      {!isLoading && filteredSongs?.length === 0 && (
        <p className="text-center text-muted-foreground mt-12">
          No songs match your search.
        </p>
      )}
    </div>
  );
}