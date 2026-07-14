import { circleClient } from "../config/circle";
import { env } from "../config/env";

export const walletService = {
  async getDetails() {
    const response = await circleClient.getWallet({ id: env.CIRCLE_WALLET_ID });
    return response.data;
  },

  async getBalance() {
    const response = await circleClient.getWalletTokenBalance({
      id: env.CIRCLE_WALLET_ID,
    });
    return response.data;
  },

  async getTransactions() {
    const response = await circleClient.listTransactions({
      walletIds: [env.CIRCLE_WALLET_ID],
    });
    return response.data;
  },
};