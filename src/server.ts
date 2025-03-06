import "module-alias/register";
import { Server } from "node:http";

import app from "./app";
import { AppConfig, Logger } from "./config";
import { ConnectDB } from "./utils";

let server: Server | null = null;
ConnectDB(AppConfig.MONGO_URI).then(() => {
  server = app.listen(AppConfig.PORT, () => {
    Logger.info(`Server Started On Port ${AppConfig.PORT}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      Logger.info("Terminated Express Server");
      process.exit(1);
    });
  } else {
    Logger.error("Server didn't start properly");
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  Logger.error(error);
  exitHandler();
};

process.on("SIGINT", () => {
  exitHandler();
});
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
