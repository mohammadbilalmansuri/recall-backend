declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
    content?: Record<string, any>;
  }
}
