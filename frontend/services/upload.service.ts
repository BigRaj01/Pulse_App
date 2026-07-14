import { UploadRequest } from "@/types";

function delay<T>(data: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const uploadService = {
  uploadTrack: async (
    data: UploadRequest,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; trackId: string }> => {
    // Mock upload with simulated progress; replace with real API call later.
    for (let percent = 0; percent <= 100; percent += 20) {
      await delay(null, 150);
      onProgress?.(percent);
    }
    return { success: true, trackId: `track-${Date.now()}` };
  },
};