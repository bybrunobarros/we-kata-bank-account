import express from "express";
import httpStatus from "http-status";
import operationRouter from "./account/operation/route.js";
import accountRouter from "./account/route.js";
import { sendError, sendPayload } from "./common/middleware/send.js";

export const createApp = (db) => {
  const app = express();

  app.use(express.json());
  app.use((req, res, next) => {
    req.context = {};
    res.sendPayload = sendPayload(res);
    res.sendError = sendError(res);
    next();
  });
  app.use("/", accountRouter(db));
  app.use("/", operationRouter(db));
  // NOTE: error handlers need four arguments https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) =>
    res.sendError(httpStatus.INTERNAL_SERVER_ERROR, err.message),
  );
  return app;
};
