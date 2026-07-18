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
    const { songId, artistAddress, secondsListened } = req.body;
    const decision = agentService.decide(secondsListened);

    if (!decision.shouldPay) {
      return res.json({ paid: false, reason: decision.reason });
    }

    const transaction = await paymentService.sendUsdc(
      artistAddress,
      decision.amount,
      `stream-${songId}-${Date.now()}`
    );

    // Log this settlement on-chain via the StreamSettlement contract.
    // We use the wallet's own address as a placeholder "listener" address since
    // we don't yet have per-user wallet addresses — this records that a stream
    // was settled, even though it doesn't yet attribute it to a specific listener wallet.
    let onChainRecord = null;
    try {
      onChainRecord = await paymentService.recordStreamOnChain(
        songId,
        artistAddress, // placeholder: using artist address for listener too, until per-user wallets exist
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