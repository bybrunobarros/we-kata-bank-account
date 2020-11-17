import { createAccount } from "./service.js";

export const create = (db) => async (req, res) => {
  const { id, created_at } = await createAccount(db)(req.body.name);

  res.json({
    status: "succeed",
    body: {
      id,
      date: new Date(created_at).toISOString().split("T")[0],
    },
  });
};
