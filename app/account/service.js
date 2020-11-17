import { createUser, findByName } from "../user/service.js";

const createAccount = (db) => async (name) => {
  let user = await findByName(name);
  if (!user) {
    user = createUser(name);
  }

  const [id] = await db("account").insert({
    user_id: user.id,
  });

  const [{ user_id, created_at }] = await db("account")
    .select("user_id", "created_at")
    .where({
      id,
    });

  return { id, user_id, created_at };
};

const findUserAccountById = (db) => async (userId, accountId) => {
  const accounts = await db("account").select("id").where({
    id: accountId,
    user_id: userId,
  });

  return accounts.length === 1 ? accounts[0] : null;
};

export { createAccount, findUserAccountById };
