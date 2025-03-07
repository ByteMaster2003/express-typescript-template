import httpStatus from "http-status";

import { catchAsync, ApiError } from "@/utils";

const roleMiddleware = (requiredRole: string) =>
  catchAsync(async (req, _res, next) => {
    const { role } = req.auth;

    if (role !== requiredRole) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[httpStatus.FORBIDDEN]);
    }
    next();
  });

export { roleMiddleware };
