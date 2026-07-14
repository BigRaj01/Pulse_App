"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player-store";
import { synthEngine } from "@/lib/synth-engine";

export function useAudioEngine() {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const repeat = usePlayerStore((s) => s.repeat);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const playNext = usePlayerStore((s) => s.playNext);

  const repeatRef = useRef(repeat);
  const playNextRef = useRef(playNext);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // Load and auto-start a new song whenever it changes
  useEffect(() => {
    if (!currentSong) return;
    synthEngine.load(currentSong.id, currentSong.duration, {
      onProgress: setProgress,
      onEnded: () => {
        if (repeatRef.current === "one") {
          synthEngine.play(0);
        } else {
          playNextRef.current();
        }
      },
    });
    synthEngine.play(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  // Respond to play/pause toggling
  useEffect(() => {
    if (isPlaying) {
      synthEngine.play();
    } else {
      synthEngine.pause();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    synthEngine.setVolume(volume);
  }, [volume]);
}