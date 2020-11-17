import express from "express";
import operationRouter from "./account/operation/route.js";
import accountRouter from "./account/route.js";

export const createApp = (db) => {
  const app = express();

  app.use(express.json());
  app.use((req, res, next) => {
    req.context = {};
    next();
  });
  app.use("/", accountRouter(db));
  app.use("/", operationRouter(db));

  return app;
};
