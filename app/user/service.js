const createUser = (db) => async (name) => {
  await db("user").insert({
    name,
  });

  return findByName(db)(name);
};

const findByName = (db) => async (name) => {
  const users = await db("user").select("id").where({ name });

  return users.length === 1 ? users[0] : null;
};

export { createUser, findByName };
