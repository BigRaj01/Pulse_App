"use client";

import { useQuery } from "@tanstack/react-query";
import { musicService } from "@/services/music.service";
import { SectionRow } from "@/components/features/section-row";
import { SongCard } from "@/components/features/song-card";
import { SongCardSkeleton } from "@/components/features/song-card-skeleton";

export default function HomePage() {
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending-songs"],
    queryFn: musicService.getTrendingSongs,
  });

  const { data: recommended, isLoading: recommendedLoading } = useQuery({
    queryKey: ["recommended-songs"],
    queryFn: musicService.getRecommendedSongs,
  });

  return (
    <div className="pb-24">
      <div className="px-4 md:px-6 pt-8">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s new for you today.
        </p>
      </div>

      <SectionRow title="Trending Now">
        {trendingLoading
          ? Array.from({ length: 5 }).map((_, i) => <SongCardSkeleton key={i} />)
          : trending?.map((song) => (
              <SongCard key={song.id} song={song} queue={trending} />
            ))}
      </SectionRow>

      <SectionRow title="Recommended For You">
        {recommendedLoading
          ? Array.from({ length: 5 }).map((_, i) => <SongCardSkeleton key={i} />)
          : recommended?.map((song) => (
              <SongCard key={song.id} song={song} queue={recommended} />
            ))}
      </SectionRow>
    </div>
  );
}