import test from "ava";
import { arrange } from "../../../test/helper/arrange-middleware.js";
import { getDateFromDatetime } from "../../common/get-date-from-datetime.js";
import { list, operate } from "./middleware.js";

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

const defaultGetRequest = {
  method: "GET",
  url: "/accounts/1/operations",
  headers: {
    Authorization: "Bearer QWxiZXJ0",
  },
  params: {
    accountId: 1,
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

  t.is(response._getStatusCode(), 200);
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

test("should subtract 20 to current balance when users make a withdrawal of 20", async (t) => {
  const { db, request, response } = await arrange(t, {
    ...defaultPostRequest,
    ...{
      body: {
        type: "withdrawal",
        amount: 20,
      },
    },
  });

  await operate(db)(request, response);

  t.is(response._getStatusCode(), 200);
  t.deepEqual(
    {
      status: "succeed",
      body: {
        operation: "withdrawal",
        amount: 20,
        balance: 60,
        date: getDateFromDatetime(),
      },
    },
    response._getJSONData(),
  );
});

test("should return an error when balance is not enough to withdraw", async (t) => {
  const { db, request, response } = await arrange(t, {
    ...defaultPostRequest,
    ...{
      body: {
        type: "withdrawal",
        amount: 100,
      },
    },
  });

  await operate(db)(request, response);

  t.is(response._getStatusCode(), 422);
  t.deepEqual(
    {
      status: "failed",
      body: { message: "Insufficient balance" },
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

test("should return a list of operations when user id and account id match", async (t) => {
  const { db, request, response } = await arrange(t, defaultGetRequest);

  await list(db)(request, response);

  t.is(response._getStatusCode(), 200);
  t.deepEqual(
    {
      status: "succeed",
      body: [
        {
          operation: "deposit",
          amount: 100,
          balance: 100,
          date: "2020-11-01",
        },
        {
          operation: "deposit",
          amount: 20,
          balance: 120,
          date: "2020-11-02",
        },
        {
          operation: "withdrawal",
          amount: 40,
          balance: 80,
          date: "2020-11-03",
        },
      ],
    },
    response._getJSONData(),
  );
});

test("should return an empty list when user id and account id don't match", async (t) => {
  const { db, request, response } = await arrange(t, {
    ...defaultGetRequest,
    ...{
      context: {
        user: {
          id: "user2",
          name: "Betty",
        },
        accountId: 1,
      },
    },
  });

  await list(db)(request, response);

  t.is(response._getStatusCode(), 200);
  t.deepEqual(
    {
      status: "succeed",
      body: [],
    },
    response._getJSONData(),
  );
});
