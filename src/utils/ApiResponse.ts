import { Response } from "express";
import { COOKIE_OPTIONS } from "../constants";

class ApiResponse<
  TData = Record<string, unknown>,
  TMeta = Record<string, unknown>
> {
  status: number;
  message: string;
  data: TData | null;
  metadata: TMeta | null;
  success: boolean;

  constructor(
    status: number,
    message = "Success",
    data: TData | null = null,
    metadata: TMeta | null = null
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

  setCookies(
    res: Response,
    cookies: { name: string; value: string; expires?: Date }[]
  ) {
    cookies.forEach(({ name, value, expires }) => {
      res.cookie(name, value, {
        ...COOKIE_OPTIONS,
        ...(expires ? { expires } : {}),
      });
    });
  }

  clearCookies(res: Response, cookies: string[]) {
    cookies.forEach((cookie) => {
      res.clearCookie(cookie, COOKIE_OPTIONS);
    });
  }
}

export default ApiResponse;
