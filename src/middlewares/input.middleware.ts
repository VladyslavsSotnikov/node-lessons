import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { HTTP_STATUS_CODES } from "../utils";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ errors: result.array() });
  }

  next();
};
