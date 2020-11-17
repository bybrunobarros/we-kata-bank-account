import test from "ava";
import { arrange } from "../../../test/helper/arrange-middleware.js";
import { getDateFromDatetime } from "../../common/get-date-from-datetime.js";
import { operate } from "./middleware.js";

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
  const { db, request, response } = await arrange(t, defaultPostRequest);

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

test("should return an error when the amount is negative", async (t) => {
  const { db, request, response } = await arrange(t, {
    ...defaultPostRequest,
    ...{
      body: {
        type: "deposit",
        amount: -20,
      },
    },
  });

  await operate(db)(request, response);

  t.is(response._getStatusCode(), 422);
  t.deepEqual(
    {
      status: "failed",
      body: { message: "Amount must be positive" },
    },
    response._getJSONData(),
  );
});

test("should return an error when the operation is not recognized", async (t) => {
  const { db, request, response } = await arrange(t, {
    ...defaultPostRequest,
    ...{
      body: {
        type: "transfer",
        amount: 20,
      },
    },
  });

  await operate(db)(request, response);

  t.is(response._getStatusCode(), 422);
  t.deepEqual(
    {
      status: "failed",
      body: { message: "Unknown operation" },
    },
    response._getJSONData(),
  );
});
