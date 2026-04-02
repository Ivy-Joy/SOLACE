//helper
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resParse = schema.safeParse(req.body);
    if (!resParse.success) return res.status(400).json({ error: resParse.error.format() });
    next();
  };
}