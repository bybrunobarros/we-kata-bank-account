import httpStatus from "http-status";

export const formatError = (httpCode, message = "") => ({
  status: "failed",
  body: { message: message || httpStatus[httpCode] },
});
