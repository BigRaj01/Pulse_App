"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player-store";
import { synthEngine } from "@/lib/synth-engine";
import { streamService } from "@/services/stream.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

// Placeholder artist payout address — same test wallet used for manual testing.
const ARTIST_PAYOUT_ADDRESS = "0x60467c58C4359816b5e42c74C1d10F4980a31921";
const PAYMENT_TRIGGER_SECONDS = 5;

export function useAudioEngine() {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const repeat = usePlayerStore((s) => s.repeat);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const playNext = usePlayerStore((s) => s.playNext);

const repeatRef = useRef(repeat);
  const playNextRef = useRef(playNext);
  const paidSongIdsRef = useRef<Set<string>>(new Set());
  const walletAddress = useAuthStore((s) => s.walletAddress);
  const walletApproved = useAuthStore((s) => s.walletApproved);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

 // Load and auto-start a new song whenever it changes
  useEffect(() => {
    if (!currentSong) return;
    synthEngine.load(currentSong.id, currentSong.duration, currentSong.genre, {
      onProgress: (seconds) => {
        setProgress(seconds);
        if (
          if (
          seconds >= PAYMENT_TRIGGER_SECONDS &&
          !paidSongIdsRef.current.has(currentSong.id) &&
          walletAddress &&
          walletApproved
        ) {
          paidSongIdsRef.current.add(currentSong.id);
          streamService
            .sendPlayEvent(currentSong.id, ARTIST_PAYOUT_ADDRESS, walletAddress, seconds)
            .then((result) => {
              if (result?.paid) {
                toast.success("Artist payment sent for this stream");
              }
            })
            .catch((err) => {
              console.error("Stream payment failed:", err);
              toast.error("Streaming payment couldn't be sent — backend may be waking up, try again shortly");
            });
        }
      },
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