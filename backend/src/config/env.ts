import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("4000"),
  APP_URL: z.string().url(),
  CIRCLE_API_KEY: z.string().min(1, "CIRCLE_API_KEY is required"),
  CIRCLE_ENTITY_SECRET: z.string().min(1, "CIRCLE_ENTITY_SECRET is required"),
  CIRCLE_WALLET_ID: z.string().min(1, "CIRCLE_WALLET_ID is required"),
  CIRCLE_USDC_TOKEN_ID: z.string().min(1, "CIRCLE_USDC_TOKEN_ID is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;