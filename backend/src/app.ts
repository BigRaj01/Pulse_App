import express from "express";
import cors from "cors";
import { env } from "./config/env";
import walletRoutes from "./routes/wallet.routes";

export const app = express();

app.use(cors({ origin: env.APP_URL }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/wallet", walletRoutes);

// Global error handler — catches anything thrown in routes/services
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
);