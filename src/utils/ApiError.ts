class ApiError extends Error {
  status: number;
  errors: any[];
  success: boolean;

  constructor(
    status: number,
    message = "Internal Server Error",
    errors: any[] = []
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
