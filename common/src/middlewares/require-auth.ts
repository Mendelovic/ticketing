import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

// it is assumed that by the time this request shows up at requireAuth it should have already been checked to see
// if there's a jwt present and should have already attempted to decode it in req.currentUser
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  // User is logged in and is allowed to continue
  next();
};
