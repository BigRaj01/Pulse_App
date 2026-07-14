import { circleClient } from "../config/circle";
import { env } from "../config/env";

export const paymentService = {
  async sendUsdc(destinationAddress: string, amount: string, refId?: string) {
    const response = await circleClient.createTransaction({
      walletId: env.CIRCLE_WALLET_ID,
      tokenId: env.CIRCLE_USDC_TOKEN_ID,
      destinationAddress,
      amount: [amount],
      fee: {
        type: "level",
        config: { feeLevel: "MEDIUM" },
      },
      refId,
    });
    return response.data;
  },
};