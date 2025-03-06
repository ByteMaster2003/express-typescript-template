import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ZodObject, ZodError, ZodRawShape } from "zod";

import { ApiError } from "@/utils";

type ValidateTypes = {
  params?: ZodObject<ZodRawShape>;
  query?: ZodObject<ZodRawShape>;
  body?: ZodObject<ZodRawShape>;
};

export const validate =
  (schema: ValidateTypes) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.params) schema.params.parse(req.params);
      if (schema.query) schema.query.parse(req.query);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((err) => err.message).join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
      return next(error);
    }
  };
