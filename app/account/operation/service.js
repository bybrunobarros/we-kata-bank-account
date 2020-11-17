const OPERATIONS = {
  deposit: (balance, amount) => balance + amount,
  withdrawal: (balance, amount) => balance - amount,
};

const OPERATION_NAMES = Object.keys(OPERATIONS);

const getLastOperation = (db) => async (userId, accountId) => {
  const operations = await db("operation")
    .where({
      account_id: accountId,
      user_id: userId,
    })
    .orderBy("id", "desc")
    .limit(1);

  return operations[0];
};

const createOperation = (db) => async ({
  userId,
  accountId,
  operationType,
  amount,
}) => {
  if (!OPERATION_NAMES.includes(operationType)) {
    return { error: "Unknown operation" };
  }
  if (amount < 0) {
    return { error: "Amount must be positive" };
  }

  const { balance: currentBalance } = await getLastOperation(db)(
    userId,
    accountId,
  );

  const newBalance = OPERATIONS[operationType](currentBalance, amount);
  if (newBalance < 0) {
    return { error: "Insufficient balance" };
  }

  await db("operation").insert({
    account_id: accountId,
    user_id: userId,
    type: operationType,
    amount,
    balance: newBalance,
  });

  return getLastOperation(db)(userId, accountId);
};

const listOperations = (db) => (userId, accountId) =>
  db("operation").select("type", "amount", "balance", "created_at").where({
    account_id: accountId,
    user_id: userId,
  });

export { createOperation, listOperations, OPERATION_NAMES };
