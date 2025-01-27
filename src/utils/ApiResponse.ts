import { Response } from "express";

class ApiResponse<T = Record<string, string | object | string | object[]>> {
  status: number;
  message: string;
  data: T | null;
  metadata: T | null;
  success: boolean;

  constructor(
    status: number,
    message = "Success",
    data: T | null = null,
    metadata: T | null = null
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.metadata = metadata;
    this.success = status < 400;
  }

  send(res: Response) {
    res.status(this.status).json({
      status: this.status,
      message: this.message,
      ...(this.data ? { data: this.data } : {}),
      ...(this.metadata ? { metadata: this.metadata } : {}),
      success: this.success,
    });
  }
}

export default ApiResponse;
