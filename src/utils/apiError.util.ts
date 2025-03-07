import { Request } from "express";

import { Logger } from "@/config";

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export function printError(req: Request, error: ApiError) {
  Logger.error("============================== Error ==============================");
  Logger.error(`Query: ${JSON.stringify(req.query)}`);
  Logger.error(`Params: ${JSON.stringify(req.params)}`);
  Logger.error(`Body: ${JSON.stringify(req.body)}\n`);
  Logger.error(`${error.stack}\n`);
  Logger.error("============================== XXXXXX ==============================");
}
