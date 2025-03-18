import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    logger.warn("[WARNING] Headers already sent, skipping error response.");
    return;
  }

  if (err instanceof ApiError) {
    logger.error(`[API ERROR] ${err.message}`, {
      status: err.status,
      errors: err.errors,
    });

    res.status(err.status).json({
      status: err.status,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
      success: err.success,
    });
    return;
  }

  logger.error(`[UNHANDLED ERROR] ${err.message}`, { stack: err.stack });

  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    success: false,
  });
};

export default globalErrorHandler;
