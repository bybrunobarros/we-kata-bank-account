import express from "express";
import Joi from "joi";
import { authenticate, authorize } from "../../auth/middleware.js";
import { asyncWrapper as _async } from "../../common/middleware/async-wrapper.js";
import { validateBody } from "../../common/middleware/validate-body.js";
import { OPERATION_NAMES } from "./service.js";

const schema = {
  operationsPost: Joi.object().keys({
    type: Joi.string()
      .required()
      .valid(...OPERATION_NAMES),
    amount: Joi.number().integer().required().greater(0),
  }),
};

export default (db) => {
  const router = express.Router();

  router
    .route("/accounts/:accountId/operations")
    .all(_async(authenticate(db), authorize(db)))
    .post(_async(validateBody(schema.operationsPost)));
  return router;
};
