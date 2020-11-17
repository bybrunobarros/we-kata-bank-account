import httpStatus from "http-status";
import { findByName } from "../user/service.js";

const decodeToken = (token) => Buffer.from(token, "base64").toString();

export const authenticate = (db) => async (req, res, next) => {
  const [, token = ""] = req.get("Authorization").split(" ");
  const user = await findByName(db)(decodeToken(token));
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: "failed",
      body: { message: httpStatus[httpStatus.UNAUTHORIZED] },
    });
  }

  req.context.user = user;
  next();
};
