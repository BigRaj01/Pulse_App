import { apiClient } from "@/lib/api-client";

export const streamService = {
  sendPlayEvent: async (
    songId: string,
    artistAddress: string,
    listenerAddress: string,
    secondsListened: number
  ): Promise<{ paid: boolean; amount?: string; reason?: string }> => {
    const res = await apiClient.post("/stream/event", {
      songId,
      artistAddress,
      listenerAddress,
      secondsListened,
    });
    return res.data;
  },
};