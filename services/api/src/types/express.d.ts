//services/api/src/types/express.d.ts
/*import * as express from 'express';
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        _id: Types.ObjectId;
        role: string;
        permissions: string[];
      }
    }
  }
}
export {};*/
import type { IAdmin } from "../models/Admin";

declare global {
  namespace Express {
    interface Request {
      admin?: IAdmin;
    }
  }
}

export {};