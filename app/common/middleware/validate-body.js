import httpStatus from "http-status";
import { formatError } from "../helper/format-error.js";

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const message = error.details.map((item) => item.message).join(",");
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(formatError(httpStatus.UNPROCESSABLE_ENTITY, message));
  }

  next();
};
