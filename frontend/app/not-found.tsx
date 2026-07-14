import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="text-muted-foreground max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
     <Button render={<Link href="/">Back to Home</Link>} />
    </div>
  );
}