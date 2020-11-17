import test from "ava";
import fetch from "node-fetch";
import { setupDatabase, setupServer } from "../../../test/helper/setup.js";

const arrange = async (t) => {
  t.context.db = await setupDatabase(t);
  await setupServer(t);
};

test("should return 401 when authentication token is not recognized", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    headers: { Authorization: "Bearer BadToken" },
  });

  t.is(response.status, 401);
});

test("should return 403 when user id and account id don't match", async (t) => {
  await arrange(t);

  const response = await fetch(
    `${t.context.prefixUrl}/accounts/account2/operations`,
    {
      headers: { Authorization: "Bearer QWxiZXJ0" },
    },
  );

  t.is(response.status, 403);
});
