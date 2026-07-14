import { z } from "zod";

export const uploadSchema = z.object({
  trackName: z.string().min(1, "Track name is required"),
  artistName: z.string().min(1, "Artist name is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string().optional(),
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Enter a valid wallet address"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export type UploadFormValues = z.infer<typeof uploadSchema>;