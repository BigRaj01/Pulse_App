export interface AgentDecision {
  shouldPay: boolean;
  amount: string;
  reason: string;
}

export interface AgentLogEntry extends AgentDecision {
  id: string;
  songId: string;
  listenerAddress: string;
  timestamp: string;
}

const activityLog: AgentLogEntry[] = [];
const MAX_LOG_ENTRIES = 200;

export function logDecision(songId: string, listenerAddress: string, decision: AgentDecision) {
  activityLog.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    songId,
    listenerAddress,
    timestamp: new Date().toISOString(),
    ...decision,
  });
  if (activityLog.length > MAX_LOG_ENTRIES) activityLog.length = MAX_LOG_ENTRIES;
}

export function getActivityLog(listenerAddress?: string): AgentLogEntry[] {
  if (!listenerAddress) return activityLog;
  return activityLog.filter(
    (entry) => entry.listenerAddress.toLowerCase() === listenerAddress.toLowerCase()
  );
}

const FLAT_PAYMENT_AMOUNT = 0.5;
const MIN_LISTEN_SECONDS = 5;
const DAILY_SPEND_CAP = 5.0; // max USDC an agent will autonomously charge per listener per day

// In-memory daily spend tracker: listenerAddress -> { date, totalSpent }.
// Resets naturally each day and on server restart — acceptable for this demo scope,
// would move to a real database for production.
const dailySpend = new Map<string, { date: string; total: number }>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getSpentToday(listenerAddress: string): number {
  const record = dailySpend.get(listenerAddress);
  if (!record || record.date !== todayKey()) return 0;
  return record.total;
}

function recordSpend(listenerAddress: string, amount: number) {
  const today = todayKey();
  const existing = dailySpend.get(listenerAddress);
  const total = existing && existing.date === today ? existing.total + amount : amount;
  dailySpend.set(listenerAddress, { date: today, total });
}

export const agentService = {
  decide(listenerAddress: string, songId: string, secondsListened: number): AgentDecision {
    let decision: AgentDecision;

    if (secondsListened < MIN_LISTEN_SECONDS) {
      decision = { shouldPay: false, amount: "0", reason: "Listened less than 5 seconds" };
    } else {
      const spentToday = getSpentToday(listenerAddress);
      const remainingBudget = DAILY_SPEND_CAP - spentToday;

      if (remainingBudget <= 0) {
        decision = {
          shouldPay: false,
          amount: "0",
          reason: `Daily autonomous spending cap of $${DAILY_SPEND_CAP.toFixed(2)} reached`,
        };
      } else {
        const amount = Math.min(FLAT_PAYMENT_AMOUNT, remainingBudget);
        recordSpend(listenerAddress, amount);
        decision = {
          shouldPay: true,
          amount: amount.toFixed(2),
          reason: `Listened ${secondsListened}s, qualifies for payment ($${spentToday.toFixed(2)} of $${DAILY_SPEND_CAP.toFixed(2)} daily budget used)`,
        };
      }
    }

    logDecision(songId, listenerAddress, decision);
    return decision;
  },
};