import httpStatus from "http-status";
import { findUserAccountById } from "../account/service.js";
import { formatError } from "../common/helper/format-error.js";
import { findByName } from "../user/service.js";

const decodeToken = (token) => Buffer.from(token, "base64").toString();

const authenticate = (db) => async (req, res, next) => {
  const [, token = ""] = req.get("Authorization").split(" ");
  const user = await findByName(db)(decodeToken(token));
  if (!user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(formatError(httpStatus.UNAUTHORIZED));
  }

  req.context.user = user;
  next();
};

const authorize = (db) => async (req, res, next) => {
  const account = await findUserAccountById(db)(
    req.context.user.id,
    req.params.accountId,
  );
  if (!account || !account.id) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json(formatError(httpStatus.FORBIDDEN));
  }

  req.context.accountId = account.id;
  next();
};

export { authenticate, authorize };
