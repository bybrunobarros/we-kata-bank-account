export const seed = async (knex) => {
  await knex("operation").del();
  const accounts = await knex("account").select();
  await knex("operation").insert([
    {
      account_id: accounts[0].id,
      user_id: accounts[0].user_id,
      type: "deposit",
      amount: 100,
      balance: 100,
      created_at: "2020-11-01 15:00:00",
    },
    {
      account_id: accounts[0].id,
      user_id: accounts[0].user_id,
      type: "deposit",
      amount: 20,
      balance: 120,
      created_at: "2020-11-02 18:00:00",
    },
    {
      account_id: accounts[0].id,
      user_id: accounts[0].user_id,
      type: "withdrawal",
      amount: 40,
      balance: 80,
      created_at: "2020-11-03 10:00:00",
    },
    {
      account_id: accounts[1].id,
      user_id: accounts[1].user_id,
      type: "deposit",
      amount: 400,
      balance: 400,
      created_at: "2020-11-01 10:00:00",
    },
    {
      account_id: accounts[1].id,
      user_id: accounts[1].user_id,
      type: "withdrawal",
      amount: 130,
      balance: 270,
      created_at: "2020-11-03 11:00:00",
    },
  ]);
};
