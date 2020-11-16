import express from "express";

export const createApp = (/* db */) => {
  const app = express();
  app.use(express.json());

  return app;
};
