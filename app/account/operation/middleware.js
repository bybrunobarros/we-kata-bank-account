import httpStatus from "http-status";
import { getDateFromDatetime } from "../../common/get-date-from-datetime.js";
import { createOperation } from "./service.js";

export const operate = (db) => async (req, res) => {
  const { accountId, user } = req.context;
  const { amount, type } = req.body;

  const operation = await createOperation(db)({
    accountId,
    userId: user.id,
    amount,
    operationType: type,
  });

  if (operation.error) {
    return res.status(httpStatus.CONFLICT).json({
      status: "failed",
      body: {
        message: operation.error,
      },
    });
  }

  res.json({
    status: "succeed",
    body: {
      amount: operation.amount,
      balance: operation.balance,
      date: getDateFromDatetime(operation.created_at),
      operation: operation.type,
    },
  });
};
