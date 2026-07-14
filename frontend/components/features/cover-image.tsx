"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-primary/60 to-accent/40",
  "from-accent/50 to-primary/30",
  "from-primary/40 to-purple-500/30",
  "from-accent/40 to-blue-500/30",
];

function gradientForString(value: string) {
  const index = value.charCodeAt(0) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function CoverImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br text-2xl font-bold text-white/80",
          gradientForString(alt),
          className
        )}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={className}
      onError={() => setFailed(true)}
    />
  );
}