// NOTE: for this exercise User.name is used to authorize HTTP requests

export const seed = async (knex) => {
  await knex("user").del();
  return knex("user").insert([
    {
      name: "Albert", // Bearer: QWxiZXJ0
    },
    {
      name: "Betty", // Bearer: QmV0dHk=
    },
  ]);
};
