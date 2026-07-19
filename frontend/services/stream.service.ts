import { apiClient } from "@/lib/api-client";

export const streamService = {
  sendPlayEvent: async (
    songId: string,
    artistAddress: string,
    listenerAddress: string,
    secondsListened: number
  ) => {
    const res = await apiClient.post("/stream/event", {
      songId,
      artistAddress,
      listenerAddress,
      secondsListened,
    });
    return res.data;
  },
};