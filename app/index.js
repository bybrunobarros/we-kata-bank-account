import express from "express";
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

  return app;
};
