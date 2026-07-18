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

  async recordStreamOnChain(
    songId: string,
    listenerAddress: string,
    artistAddress: string,
    amount: string
  ) {
    // Amount is recorded on-chain as an integer in USDC's smallest unit (6 decimals),
    // e.g. "0.50" USDC becomes 500000.
    const amountInSmallestUnit = Math.round(parseFloat(amount) * 1_000_000).toString();

    const response = await circleClient.createContractExecutionTransaction({
      walletId: env.CIRCLE_WALLET_ID,
      contractAddress: env.STREAM_SETTLEMENT_CONTRACT_ADDRESS,
      abiFunctionSignature: "recordStream(string,address,address,uint256)",
      abiParameters: [songId, listenerAddress, artistAddress, amountInSmallestUnit],
      fee: {
        type: "level",
        config: { feeLevel: "MEDIUM" },
      },
    });
    return response.data;
  },
};