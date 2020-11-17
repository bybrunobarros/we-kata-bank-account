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

  res.json({
    status: "succeed",
    body: {
      amount: operation.amount,
      balance: operation.balance,
      date: new Date(operation.created_at).toISOString().split("T")[0],
      operation: operation.type,
    },
  });
};
