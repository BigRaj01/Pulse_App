"use client";

import { useAudioEngine } from "@/hooks/use-audio-engine";

export function AudioEngineProvider() {
  useAudioEngine();
  return null;
}