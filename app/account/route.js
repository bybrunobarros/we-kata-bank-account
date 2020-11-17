import express from "express";
import { asyncWrapper as _async } from "../common/middleware/async-wrapper.js";
import { create } from "./middleware.js";

export default (db) => {
  const router = express.Router();

  router.route("/accounts").post(_async(create(db)));

  return router;
};
