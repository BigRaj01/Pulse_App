import { Request, Response, NextFunction } from "express";
import { agentService } from "../services/agent.service";
import { paymentService } from "../services/payment.service";
import { StreamEventInput } from "../validators/stream.validator";

export async function handleStreamEvent(
  req: Request<{}, {}, StreamEventInput>,
  res: Response,
  next: NextFunction
) {
  try {
   const { songId, artistAddress, listenerAddress, secondsListened } = req.body;
    const decision = agentService.decide(listenerAddress, secondsListened);

    if (!decision.shouldPay) {
      return res.json({ paid: false, reason: decision.reason });
    }

    // Charge the listener's connected wallet directly, using their one-time USDC approval.
    const transaction = await paymentService.chargeListenerWallet(
      listenerAddress,
      decision.amount
    );

    // Log this settlement on-chain via the StreamSettlement contract, now with the real listener.
    let onChainRecord = null;
    try {
      onChainRecord = await paymentService.recordStreamOnChain(
        songId,
        listenerAddress,
        artistAddress,
        decision.amount
      );
    } catch (err) {
      console.error("Failed to record stream on-chain:", err);
    }

    res.json({
      paid: true,
      amount: decision.amount,
      reason: decision.reason,
      transaction,
      onChainRecord,
    });
  } catch (err) {
    next(err);
  }
}