import { IContent } from "../models/content.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
      content?: IContent;
    }
  }
}

export {};
