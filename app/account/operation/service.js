const OPERATIONS = {
  deposit: (balance, amount) => balance + amount,
  withdrawal: (balance, amount) => balance - amount,
};

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

export const createOperation = (db) => async ({
  userId,
  accountId,
  operationType,
  amount,
}) => {
  if (!Object.keys(OPERATIONS).includes(operationType)) {
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
    amount: amount,
    balance: newBalance,
  });

  return getLastOperation(db)(userId, accountId);
};
