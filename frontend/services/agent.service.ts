import { apiClient } from "@/lib/api-client";

export interface AgentLogEntry {
  id: string;
  songId: string;
  listenerAddress: string;
  shouldPay: boolean;
  amount: string;
  reason: string;
  timestamp: string;
}

export const agentActivityService = {
  getLog: async (listenerAddress: string): Promise<AgentLogEntry[]> => {
    const res = await apiClient.get<{ log: AgentLogEntry[] }>("/stream/activity-log", {
      params: { listenerAddress },
    });
    return res.data.log;
  },
};