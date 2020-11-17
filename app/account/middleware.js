import { getDateFromDatetime } from "../common/helper/get-date-from-datetime.js";
import { createAccount } from "./service.js";

const format = ({ id, created_at }) => ({
  id,
  date: getDateFromDatetime(created_at),
});

export const create = (db) => async (req, res) => {
  const account = await createAccount(db)(req.body.name);

  res.sendPayload(format, account);
};
