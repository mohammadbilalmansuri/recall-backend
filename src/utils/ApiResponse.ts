import { Response } from "express";
import { COOKIE_OPTIONS } from "../constants";

class ApiResponse<
  TData = Record<string, unknown>,
  TMeta = Record<string, unknown>
> {
  private readonly res: Response;
  private readonly status?: number;
  private readonly message?: string;
  private readonly data?: TData | null;
  private readonly metadata?: TMeta | null;
  private readonly success?: boolean;

  constructor(
    res: Response,
    status?: number,
    message?: string,
    data?: TData | null,
    metadata?: TMeta | null
  ) {
    this.res = res;

    if (status !== undefined) {
      this.status = status;
      this.message = message ?? "Success";
      this.data = data ?? null;
      this.metadata = metadata ?? null;
      this.success = status < 400;
    }
  }

  setCookies(
    cookies: Array<{ name: string; value: string; expires?: Date }>
  ): this {
    cookies.forEach(({ name, value, expires }) => {
      this.res.cookie(name, value, {
        ...COOKIE_OPTIONS,
        ...(expires && { expires }),
      });
    });
    return this;
  }

  clearCookies(cookies: string[]): this {
    cookies.forEach((cookie) => this.res.clearCookie(cookie, COOKIE_OPTIONS));
    return this;
  }

  send(): void {
    if (this.status === undefined)
      throw new Error("Status is required for sending a response.");

    this.res.status(this.status).json({
      status: this.status,
      message: this.message,
      ...(this.data && { data: this.data }),
      ...(this.metadata && { metadata: this.metadata }),
      success: this.success,
    });
  }
}

export default ApiResponse;
