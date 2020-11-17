import httpStatus from "http-status";
import { getDateFromDatetime } from "../../common/helper/get-date-from-datetime.js";
import { createOperation, listOperations } from "./service.js";

const format = (operation) => ({
  amount: operation.amount,
  balance: operation.balance,
  date: getDateFromDatetime(operation.created_at),
  operation: operation.type,
});

const list = (db) => async (req, res) => {
  const { user, accountId } = req.context;
  const operations = await listOperations(db)(user.id, accountId);

  res.sendPayload(format, operations);
};

const operate = (db) => async (req, res) => {
  const { accountId, user } = req.context;
  const { amount, type } = req.body;

  const operation = await createOperation(db)({
    accountId,
    userId: user.id,
    amount,
    operationType: type,
  });

  if (operation.error) {
    return res.sendError(httpStatus.UNPROCESSABLE_ENTITY, operation.error);
  }

  res.sendPayload(format, operation);
};

export { list, operate };
