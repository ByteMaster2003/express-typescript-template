import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import httpStatus from "http-status";

import { morganConfig } from "./config";
import { errorConverter, errorHandler } from "./middlewares";
import { v1AppRoutes } from "./routes";
import { ApiError } from "./utils";

const app = express();

app.use(morganConfig.errorHandler);
app.use(morganConfig.successHandler);

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// sanitize request data
app.use(ExpressMongoSanitize());

// enable cors
app.options("*", cors());
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization", "X-Refresh-Token"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
  })
);

// set security HTTP headers
app.use(helmet());

// Enable trust proxy
app.set("trust proxy", 1);

// v1 api routes
app.use("/api/v1", v1AppRoutes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  console.log("Inside 404!");
  next(new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND]));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
