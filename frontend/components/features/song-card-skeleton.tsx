export function SongCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-card/50 p-3 animate-pulse">
      <div className="aspect-square w-full rounded-xl bg-secondary" />
      <div className="h-3 w-3/4 rounded bg-secondary" />
      <div className="h-3 w-1/2 rounded bg-secondary" />
    </div>
  );
}