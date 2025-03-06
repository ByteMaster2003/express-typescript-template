import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Error as MongooseError } from "mongoose";

import { AppConfig, Logger } from "@/config";
import { ApiError } from "@/utils";

type ErrorResponse = {
  success: boolean;
  message: string;
  stack?: string;
};

const errorConverter = (
  err: Error | ApiError,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error instanceof MongooseError ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, err.stack);
  }
  next(error as ApiError);
};

const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const { statusCode, message } = err;
  const response: ErrorResponse = {
    success: false,
    message
  };
  if (AppConfig.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.locals.errorMessage = err.message;
  Logger.error("============================== Error ==============================");
  Logger.info(`Query: ${JSON.stringify(req.query)}`);
  Logger.info(`Params: ${JSON.stringify(req.params)}`);
  Logger.info(`Body: ${JSON.stringify(req.body)}\n`);
  Logger.info(`${err.stack}\n`);
  Logger.error("============================== XXXXXX ==============================");
  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
