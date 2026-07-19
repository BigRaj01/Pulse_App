import { z } from "zod";

export const streamEventSchema = z.object({
  songId: z.string().min(1),
  artistAddress: z.string().min(1),
  listenerAddress: z.string().min(1),
  secondsListened: z.number().min(0),
});

export type StreamEventInput = z.infer<typeof streamEventSchema>;