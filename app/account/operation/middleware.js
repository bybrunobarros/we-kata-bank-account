import httpStatus from "http-status";
import { formatError } from "../../common/helper/format-error.js";
import { getDateFromDatetime } from "../../common/helper/get-date-from-datetime.js";
import { createOperation, listOperations } from "./service.js";

const formatBody = (operation) => ({
  amount: operation.amount,
  balance: operation.balance,
  date: getDateFromDatetime(operation.created_at),
  operation: operation.type,
});

const list = (db) => async (req, res) => {
  const { user, accountId } = req.context;
  const operations = await listOperations(db)(user.id, accountId);

  return res.json({
    status: "succeed",
    body: operations.map(formatBody),
  });
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
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json(formatError(httpStatus.UNPROCESSABLE_ENTITY, operation.error));
  }

  res.json({
    status: "succeed",
    body: formatBody(operation),
  });
};

export { list, operate };
