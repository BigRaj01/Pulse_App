import { Router } from "express";
import {
  getBalanceHandler,
  getDetailsHandler,
  getTransactionsHandler,
  sendUsdcHandler,
} from "../controllers/wallet.controller";
import { validate } from "../middleware/validate";
import { sendUsdcSchema } from "../validators/payment.validator";

const router = Router();

router.get("/balance", getBalanceHandler);
router.get("/details", getDetailsHandler);
router.get("/transactions", getTransactionsHandler);
router.post("/send", validate(sendUsdcSchema), sendUsdcHandler);

export default router;