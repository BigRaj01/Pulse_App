import { Request, Response, NextFunction } from "express";
import { walletService } from "../services/wallet.service";
import { paymentService } from "../services/payment.service";
import { SendUsdcInput } from "../validators/payment.validator";
export async function getDetailsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const details = await walletService.getDetails();
    res.json(details);
  } catch (err) {
    next(err);
  }
}
export async function getTransactionsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const transactions = await walletService.getTransactions();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}
export async function getBalanceHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const balance = await walletService.getBalance();
    res.json(balance);
  } catch (err) {
    next(err);
  }
}

export async function sendUsdcHandler(
  req: Request<{}, {}, SendUsdcInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { destinationAddress, amount, refId } = req.body;
    const result = await paymentService.sendUsdc(destinationAddress, amount, refId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}