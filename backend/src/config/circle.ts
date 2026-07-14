import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { env } from "./env";

export const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey: env.CIRCLE_API_KEY,
  entitySecret: env.CIRCLE_ENTITY_SECRET,
});