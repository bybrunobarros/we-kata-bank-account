import test from "ava";
import fetch from "node-fetch";
import { setupDatabase, setupServer } from "../../test/helper/setup.js";
import { getDateFromDatetime } from "../common/helper/get-date-from-datetime.js";

const arrange = async (t) => {
  t.context.db = await setupDatabase(t);
  await setupServer(t);
};

test("should create a new account when requested", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Charles",
    }),
  });

  t.is(response.status, 200);
  t.deepEqual(await response.json(), {
    status: "succeed",
    body: {
      id: 3,
      date: getDateFromDatetime(),
    },
  });
});
