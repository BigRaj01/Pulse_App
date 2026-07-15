export interface AgentDecision {
  shouldPay: boolean;
  amount: string;
  reason: string;
}

const FLAT_PAYMENT_AMOUNT = "0.50";
const MIN_LISTEN_SECONDS = 5;

export const agentService = {
  decide(secondsListened: number): AgentDecision {
    if (secondsListened < MIN_LISTEN_SECONDS) {
      return { shouldPay: false, amount: "0", reason: "Listened less than 5 seconds" };
    }

    return {
      shouldPay: true,
      amount: FLAT_PAYMENT_AMOUNT,
      reason: `Listened ${secondsListened}s, qualifies for flat payment`,
    };
  },
};