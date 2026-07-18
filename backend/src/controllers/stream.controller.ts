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

    res.json({ paid: true, amount: decision.amount, reason: decision.reason, transaction });
  } catch (err) {
    next(err);
  }
}