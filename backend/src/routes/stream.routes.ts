import { Router } from "express";
import { handleStreamEvent, getActivityLogHandler } from "../controllers/stream.controller";
import { validate } from "../middleware/validate";
import { streamEventSchema } from "../validators/stream.validator";

const router = Router();

router.post("/event", validate(streamEventSchema), handleStreamEvent);
router.get("/activity-log", getActivityLogHandler);

export default router;