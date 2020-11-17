import { getDateFromDatetime } from "../common/get-date-from-datetime.js";
import { createAccount } from "./service.js";

export const create = (db) => async (req, res) => {
  const { id, created_at } = await createAccount(db)(req.body.name);

  res.json({
    status: "succeed",
    body: {
      id,
      date: getDateFromDatetime(created_at),
    },
  });
};
