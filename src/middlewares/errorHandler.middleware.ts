import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import ApiError from "../utils/ApiError.ts";

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
      success: err.success,
    });
  }

  console.error("Unhandled Error: ", err);
  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    success: false,
  });
};

export default globalErrorHandler;
