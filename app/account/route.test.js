import test from "ava";
import fetch from "node-fetch";
import { setupDatabase, setupServer } from "../../test/helper/setup.js";
import { getDateFromDatetime } from "../common/get-date-from-datetime.js";

const arrange = async (t) => {
  t.context.db = await setupDatabase(t);
  await setupServer(t);
};

test("should create a new account when requested", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts`, {
    method: "post",
    body: {
      name: "Charles",
    },
  });

  t.deepEqual(
    {
      status: "succeed",
      body: {
        id: 3,
        date: getDateFromDatetime(),
      },
    },
    await response.json(),
  );
});
