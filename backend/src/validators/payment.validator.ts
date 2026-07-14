import { z } from "zod";

export const sendUsdcSchema = z.object({
  destinationAddress: z.string().min(1, "destinationAddress is required"),
  amount: z.string().regex(/^\d+(\.\d+)?$/, "amount must be a decimal string, e.g. \"0.50\""),
  refId: z.string().optional(),
});

export type SendUsdcInput = z.infer<typeof sendUsdcSchema>;