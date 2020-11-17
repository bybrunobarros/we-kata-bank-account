import { createUser, findByName } from "../user/service.js";

export const createAccount = (db) => async (name) => {
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
