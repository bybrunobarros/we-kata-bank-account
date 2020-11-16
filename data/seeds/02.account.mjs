export const seed = async (knex) => {
  await knex("account").del();
  const userIds = await knex.table("user").pluck("id");
  await knex("account").insert([
    {
      user_id: userIds[0],
    },
    {
      user_id: userIds[1],
    },
  ]);
};
