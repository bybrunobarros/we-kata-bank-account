import test from "ava";
import httpMocks from "node-mocks-http";
import { initDatabase } from "../../../data/init-database.js";
import { getDateFromDatetime } from "../../common/get-date-from-datetime.js";
import { operate } from "./middleware.js";

const setupDatabase = async (t) => {
  try {
    const db = initDatabase();
    t.teardown(async () => await db.migrate.down());

    await db.migrate.latest();
    await db.seed.run();

    return db;
  } catch (e) {
    console.error(e);
  }
};

const defaultPostRequest = {
  method: "POST",
  url: "/accounts/1/operations",
  headers: {
    Authorization: "Bearer QWxiZXJ0",
  },
  params: {
    accountId: 1,
  },
  body: {
    type: "deposit",
    amount: 20,
  },
  context: {
    user: {
      id: 1,
      name: "Albert", // Bearer: QWxiZXJ0
    },
    accountId: 1,
  },
};

test("should add 20 to current balance when users make a deposit of 20", async (t) => {
  const db = await setupDatabase(t);
  const request = httpMocks.createRequest({
    ...defaultPostRequest,
  });
  let response = httpMocks.createResponse();

  await operate(db)(request, response);

  t.deepEqual(
    {
      status: "succeed",
      body: {
        operation: "deposit",
        amount: 20,
        balance: 100,
        date: getDateFromDatetime(),
      },
    },
    response._getJSONData(),
  );
});
