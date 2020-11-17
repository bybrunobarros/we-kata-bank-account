import httpStatus from "http-status";

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const message = error.details.map((item) => item.message).join(",");
    return res.sendError(httpStatus.UNPROCESSABLE_ENTITY, message);
  }

  next();
};
