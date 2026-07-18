"use client";

import { useEffect } from "react";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { apiClient } from "@/lib/api-client";

export function AudioEngineProvider() {
  useAudioEngine();

  useEffect(() => {
    apiClient.get("/health").catch(() => {
      // Ignore — this is just a best-effort wake-up ping for Render's free tier.
    });
  }, []);

  return null;
}