import express from "express";
import { authenticate, authorize } from "../../auth/middleware.js";
import { asyncWrapper as _async } from "../../common/middleware/async-wrapper.js";

export default (db) => {
  const router = express.Router();

  router
    .route("/accounts/:accountId/operations")
    .all(_async(authenticate(db), authorize(db)));
  return router;
};
