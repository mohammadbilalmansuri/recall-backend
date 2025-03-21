import { ALLOWED_ORIGINS } from "./constants";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

import authRoutes from "./routes/auth.routes";
import contentRoutes from "./routes/content.routes";
import shareRoutes from "./routes/share.routes";
import aiRoutes from "./routes/ai.routes";
import globalErrorHandler from "./middlewares/errorHandler.middleware";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/share", shareRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(globalErrorHandler);

export default app;
