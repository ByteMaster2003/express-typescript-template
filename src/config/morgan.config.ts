import { Response } from "express";
import morgan from "morgan";

import { AppConfig } from "./env.config";
import { Logger } from "./logger.config";

morgan.token("message", (_, res: Response) => res.locals.errorMessage || "");

const getIpFormat = () => (AppConfig.NODE_ENV === "production" ? ":remote-addr - " : "");
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (_, res) => res.statusCode >= 400,
  stream: { write: (message) => Logger.info(message.trim()) }
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_, res) => res.statusCode < 400,
  stream: { write: (message) => Logger.error(message.trim()) }
});

export default { successHandler, errorHandler };
